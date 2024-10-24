import helmet from "helmet";

export const runHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self"],
      connectSrc: ["'self'", "http://localhost:5173"],
      ...(process.env.NODE_ENV === 'development' ? {
        scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"]
      } : {})
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});
