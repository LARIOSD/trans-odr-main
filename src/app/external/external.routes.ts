import { BaseRouter } from '@common/bases/router.base';
import { ExternalController } from './external.controller';
import { sessionMiddleware } from 'src/middlewares/session.middleware';

export class ExternalRouter extends BaseRouter<ExternalController> {
    constructor() {
        super(ExternalController,"external")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}/google/maps`)
            .get(sessionMiddleware,(req, res) => this.controller.GetMaps(req, res))
    }
}