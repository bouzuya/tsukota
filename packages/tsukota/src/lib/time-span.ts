import { getConfig } from "./config";

export async function timeSpan<T>(
  label: string,
  callback: () => Promise<T>
): Promise<T> {
  if (!getConfig().enableDebugLogging) return await callback();
  const start = new Date();
  console.log(`${label} start`, start.toISOString());
  const result = await callback();
  const end = new Date();
  console.log(
    `${label}   end`,
    end.toISOString(),
    end.getTime() - start.getTime(),
    "ms"
  );
  return result;
}
