/***const RolesService = require('../../../services/roles/roles.service');

class RolesController {
  async createRole(req, res) {
    const { title, access } = req.body;
    const result = await RolesService.createRole(title, access);
    return res.status(result.success ? 201 : 400).json(result);
  }

  async getRoles(req, res) {
    const pageNumber = parseInt(req.query.page_number) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await RolesService.getRoles(pageNumber, limit);
    return res.status(result.success ? 200 : 400).json(result);
  }
}***/

var { supabaseInstance } = require("../../../supabase-db/index.js");

const RolesService = require("../../../application/services/roles/roles.service.js");

const rolesservice = new RolesService(supabaseInstance);

exports.createRoleController = async (req, res) => {
    /*
    #swagger.tags = ['Users']

    #swagger.description = 'Get user profile details'

  */

    try {
        const { title, access } = req.body;
        const result = await rolesservice.createRole(title, access);
        return res.status(200).json({
            success: true,
            message: "create role successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error || "Something went wrong!" });
    }
};

exports.getRoleController = async (req, res) => {
    /*
    #swagger.tags = ['Users']

    #swagger.description = 'Get user profile details'

  */

    try {
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await rolesservice.getRoles(pageNumber, limit);
        return res.status(200).json({
            success: true,
            message: "get role fetch successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error || "Something went wrong!" });
    }
};
