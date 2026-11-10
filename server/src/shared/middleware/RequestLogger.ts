import morgan from "morgan";
import logger from "../../config/logger";

const stream = {
    write: (message: string) => {
        logger.http(message.trim())
    }
}

const requestLogger = morgan(
    ":method :url :status :response-time ms",
    {stream}
)

export default requestLogger