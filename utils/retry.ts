export async function retry<T>(
  action: () => Promise<T>,
  { retries = 2, delayMs = 500, label = 'action' } = {}
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt === retries) throw error;
      console.log(`${label} failed (attempt ${attempt}/${retries}), retrying...`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error(`${label} failed after ${retries} attempts`);
}
