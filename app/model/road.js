import { findAll, createData, updateData } from "../datamapper/road.js";

class Road {
    static async findAllRoads(userId) {
        return findAll(userId);
    }

    static async createRoad(userId, road) {
        return createData(userId, road);
    }

    static async updateRoad(roadId, roadData) {
        return updateData(roadId, roadData);
    }
}

export { Road };