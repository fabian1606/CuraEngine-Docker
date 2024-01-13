import passport from 'passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { API_KEY } from '../constants';

export default (): void => {
  passport.use(new HeaderAPIKeyStrategy(
    { header: 'Authorization', prefix: 'Api-Key ' },
    false,
    function(apikey:string, done: (error: Error | null, Success?: Boolean) => void,) {
      if(API_KEY === apikey) return done(null, true);
      else return done(null, false);
    }
  ));
};
