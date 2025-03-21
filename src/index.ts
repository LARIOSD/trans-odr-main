import express from 'express';

import cors from 'cors';
import * as http from 'http';
import * as https from 'https';
import { readFileSync } from 'fs';
import { ROUTES } from '@app/app.routes';
import { logger } from './helpers/logger';
import { PostgresDB } from '@config/postgres.config'
import { UsuarioDto } from '@app/usuarios/usuarios.dto';
import { CONFIG_ENV } from './common/constants/server.constants';
import cron from 'node-cron';



declare global {
    namespace Express {
        interface Request {
            usuario: UsuarioDto;
        }
    }
}


class Server {

    private app: express.Application = express();
    private port: number = Number(process.env.PORT ?? 3000);
    private routes: express.Router[] = ROUTES;
    private isHttps: boolean = CONFIG_ENV.isHttps;


    private postgres: PostgresDB = new PostgresDB();

    constructor() {
        this.app.disabled('x-powered-by');
        this.app.use(cors())
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());

        this.app.use("/api/v1", logger, this.routes);

        this.app.use("/cronjob", (_, __) => { console.log('😊 Reviviendo servicio 😊'); });

        this.app.use((_, res) => { res.status(404).json({ statusCode: 404, message: 'No se ha encontrado la ruta' }) })

        this.run();

        // const ejecutarTarea = () => {
        //     fetch(`${process.env.URL_WS_APP}/cronjob`, {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //     })
        // };

        // cron.schedule('*/5 * * * *', ejecutarTarea);
    }

    private setupHttpsOptions(): https.ServerOptions | null {
        if (this.isHttps) {
          return {
            key  : readFileSync(CONFIG_ENV.key_https),
            cert : readFileSync(CONFIG_ENV.cert_https),
          };
        }
        return null;
      }
    
    public async run(): Promise<void> {
        try {
          const server = await this.createServer();
          server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
          });

          this.postgres.test();
        } catch (error) {
          console.error('Failed to run server on port', this.port);
          console.error('Error:', error);
        }
      }

    private async createServer(): Promise<http.Server | https.Server> {
        try {
          const httpsOptions = this.setupHttpsOptions();
          if (httpsOptions) {
            return https.createServer(httpsOptions, this.app);
          }
          return http.createServer(this.app);
        } catch (error: any) {
          console.error('Error creating the server:', error.message);
          throw error;
        }
      }

/*     listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);

            this.postgres.test()
        });
    }
 */

}

new Server();