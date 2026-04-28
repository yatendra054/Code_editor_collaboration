import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || "http://localhost:2358";

// Judge0 language IDs (v1.13.1)
const LANGUAGE_ID_MAP = {
  javascript: 63, 
  python: 71,     
  java: 62,       
  cpp: 54,        
};

// Status IDs: 1=In Queue, 2=Processing, 3=Accepted, 4=Wrong Answer,
//             5=TLE, 6=Compilation Error, 7-12=various runtime errors
const PROCESSING_STATUSES = [1, 2];

const codeExecutionQueue = new Map();

/**
 * Poll Judge0 for the result of a submission until it finishes.
 */
async function pollSubmission(token, maxAttempts = 30, intervalMs = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await axios.get(
      `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`,
      { 
        timeout: 5000
      }
    );
    const { status } = res.data;
    console.log(`Poll #${i + 1} - status: ${status?.id} (${status?.description})`);

    if (!PROCESSING_STATUSES.includes(status?.id)) {
      return res.data; // finished
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Execution timed out while polling for result");
}

export const executeCode = async (roomId, code, language, version, input) => {
  try {
    if (!codeExecutionQueue.has(roomId)) {
      codeExecutionQueue.set(roomId, []);
    }

    return new Promise((resolve) => {
      const task = async () => {
        try {
          const languageId = LANGUAGE_ID_MAP[language];

          if (!languageId) {
            resolve({
              run: { output: `Error: Unsupported language "${language}"` },
            });
            return;
          }

          console.log(`Submitting ${language} (id=${languageId}) to Judge0...`);

          // Step 1: Create submission (without wait=true, use polling instead)
          const createRes = await axios.post(
            `${JUDGE0_API_URL}/submissions?base64_encoded=false`,
            {
              language_id: languageId,
              source_code: code,
              stdin: input || "",
            },
            { 
              timeout: 10000
            }
          );


          const token = createRes.data.token;
          console.log(`Submission token: ${token}`);

          if (!token) {
            resolve({
              run: { output: "Error: Judge0 did not return a submission token" },
            });
            return;
          }

          // Step 2: Poll for the result
          const result = await pollSubmission(token);
          console.log(`Judge0 result:`, JSON.stringify(result, null, 2));

          const { stdout, stderr, compile_output, status, message } = result;

          // Build output from Judge0 response
          let output = "";

          if (status?.id === 6) {
            // Compilation error
            output = compile_output || "Compilation error";
          } else if (status?.id >= 7 && status?.id <= 12) {
            // Runtime errors (SIGSEGV, SIGXFSZ, SIGFPE, SIGABRT, NZEC, Other)
            output = stderr || message || status?.description || "Runtime error";
          } else if (status?.id === 5) {
            // Time limit exceeded
            output = "Error: Time Limit Exceeded";
          } else if (status?.id === 3 || status?.id === 4) {
            // Accepted or Wrong Answer — both have valid stdout
            output = stdout?.trim() || "";
            if (stderr) {
              output += (output ? "\n" : "") + stderr.trim();
            }
          } else {
            // Fallback for any other status
            output = stdout?.trim() || stderr?.trim() || compile_output?.trim() || message || status?.description || "No output";
          }

          resolve({ run: { output } });
        } catch (error) {
          console.error("Execution error:", error.message);

          resolve({
            run: {
              output:
                error.response?.data?.message ||
                error.response?.data?.error ||
                `Error: ${error.message}`,
            },
          });
        } finally {
          // Remove finished task from queue
          codeExecutionQueue.get(roomId).shift();

          // Run next task immediately if exists
          if (codeExecutionQueue.get(roomId).length > 0) {
            codeExecutionQueue.get(roomId)[0]();
          } else {
            // Clean up if queue empty
            codeExecutionQueue.delete(roomId);
          }
        }
      };

      // Add task to queue
      codeExecutionQueue.get(roomId).push(task);

      // Run immediately if it's the first task
      if (codeExecutionQueue.get(roomId).length === 1) {
        task();
      }
    });
  } catch (error) {
    return { run: { output: `System error: ${error.message}` } };
  }
};
