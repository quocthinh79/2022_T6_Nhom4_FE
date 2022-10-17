import routesConfig from "~/config/routes";
import CrawlWeatherData from "~/pages/CrawlWeatherData";

const publicRoutes = [{ path: routesConfig[0].path, page: CrawlWeatherData }];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
