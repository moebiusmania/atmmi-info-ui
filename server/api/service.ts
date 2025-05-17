type Schema = {
  status: string;
  now: Date;
  routes: string[];
};

export default defineEventHandler((): Schema => {
  return {
    status: "Up & running",
    now: new Date(),
    routes: ["/traffic", "/v1/status", "/news", "/surface"],
  };
});
