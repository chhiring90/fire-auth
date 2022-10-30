import {AuthenticateFn, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  ExpressRequestHandler,
  FindRoute,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {debug} from 'console';
import cors from 'cors';

const SequenceActions = RestBindings.SequenceActions;

const middlewareList: ExpressRequestHandler[] = [
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
];

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    public authenticateRequest: AuthenticateFn,
    @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
    protected invokeMiddleware: InvokeMiddleware,
  ) {}

  async handle(context: RequestContext): Promise<void> {
    try {
      const {request, response} = context;

      const finished = await this.invokeMiddleware(context, middlewareList);
      if (finished) return;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      await this.authenticateRequest(request);
      const result = await this.invoke(route, args);

      debug('%s result -', route.describe(), result);
      this.send(response, result);
    } catch (error) {
      this.reject(context, error);
    }
  }
}
