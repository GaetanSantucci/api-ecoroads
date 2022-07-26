//~ IMPORTATION User DATA
import { findAll, findOneUserProfile, findOne, createData, updateData, deleteData } from "../datamapper/user.js";

class User {
    static async findAllUsers() {
        return findAll();
    }

    static async findOneProfile(user, columnName) {
        return findOneUserProfile(user, columnName);
    }

    static async findOneUser(email, columnName) {
        return findOne(email, columnName);
    }

    static async createUser(userData) {
        return createData(userData);
    }

    static async updateUser(userId, userData) {
        return updateData(userId, userData);
    }

    static async deleteUser(userId) {
        return deleteData(userId);
    }
}

export { User };