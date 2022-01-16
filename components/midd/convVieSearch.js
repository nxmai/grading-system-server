import { convVie } from "../../utils/convVie.js";

export const convVieSearch = (req, _, next) => {
    Object.keys(req.query).forEach((element) => {
        if (element.indexOf('__search') === 0) {
            req.query[element] = convVie(req.query[element]).toLowerCase();
        }
    });
    next();
};
