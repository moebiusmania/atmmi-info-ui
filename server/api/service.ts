type Schema = {
  status: string;
  now: Date;
  routes: string[];
};

export default defineEventHandler((): Schema => {
  return {
    status: "Up & running",
    now: new Date(),
    routes: ["/traffic", "/status", "/news"],
  };
});
