export const ok = <T>(data: T, message = "OK") => ({
  code: "200",
  message,
  data,
});

export const paginated = <T>(
  data: T[],
  total_count: number,
  result_count: number,
) => ({
  code: "200",
  message: "OK",
  data,
  total_count,
  result_count,
});
