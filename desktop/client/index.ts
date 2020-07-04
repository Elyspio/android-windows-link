import {ArgumentParser} from "argparse"
import {createServer} from "./server/client";
import {expressPort} from "./config/const";
import {logger} from "./util/logger";
import {register} from "./core/http";

if (require.main === module) {

    const parser = new ArgumentParser();
    parser.addArgument("--port", {type: "int", defaultValue: expressPort})
    const {port} = parser.parseArgs();

    const app = createServer()

    app.listen(port, () => {
        logger.info(`express server is listening on port ${port}`)
        register();
    })
}
