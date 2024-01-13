import type { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export default (req: Request, res: Response, next: NextFunction): void => {
  // Call passport.authenticate and pass the request, response, and next
  passport.authenticate('headerapikey', (error: Error, Success: Boolean): void => {
    if (error) {
      next(new Error("not authenticated"));
    } else if (!Success) {
      next(new Error("invalid api key"));
    } else {
      // If authentication is successful, call next
      next();
    }
  })(req, res, next); // <-- Call the returned middleware with req, res, and next
};