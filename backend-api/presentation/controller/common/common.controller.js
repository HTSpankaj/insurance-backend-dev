const { supabaseInstance } = require("../../../supabase-db/index.js");
const CityService = require("../../../application/services/stateCity/city.service.js");
const StateService = require("../../../application/services/stateCity/state.service.js");

const stateService = new StateService(supabaseInstance);
const cityService = new CityService(supabaseInstance);

//* State Controller
exports.getStateController = async (req, res) => {
    /*
    #swagger.tags = ['Common']

    #swagger.description = 'Get state list.'

  */

    try {
        const { list, total } = await stateService.getStateService();
        return res.status(200).json({
            success: true,
            message: "Get states successfully.",
            data: list,
            metadata: {
                total_count: total,
            },
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};

exports.getStateWithCityController = async (req, res) => {
    /*
    #swagger.tags = ['Common']

    #swagger.description = 'Get state with city list.'

  */

    try {
        const { list, total } = await stateService.getStateWithCityService();
        return res.status(200).json({
            success: true,
            message: "Get states successfully.",
            data: list,
            metadata: {
                total_count: total,
            },
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};

exports.addStateController = async (req, res) => {
    /*
    #swagger.tags = ['Common']

    #swagger.description = 'Add state.'
    #swagger.parameters['body'] ={
        in: 'body',
        description: 'Add User',
        schema: {
          "title": "",
        }
    }
  */

    try {
        const { title } = req.body;
        const result = await stateService.addStateService(title);
        return res.status(201).json({
            success: true,
            message: "Add state successfully.",
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};

exports.activeInactiveStateController = async (req, res) => {
    /*
    #swagger.tags = ['Common']

    #swagger.description = 'Active/Inactive state.'
    #swagger.parameters['body'] ={
        in: 'body',
        description: 'Add User',
        schema: {
          "id": "",
          "is_active": true,
        }
    }
  */

    try {
        const { id, is_active } = req.body;
        const result = await stateService.activeInactiveStateService(id, is_active);
        return res.status(200).json({
            success: true,
            message: `State ${is_active ? "activated" : "deactivated"} successfully.`,
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};

exports.updateStateController = async (req, res) => {
    /*
    #swagger.tags = ['Common']

    #swagger.description = 'Update state.'
    #swagger.parameters['body'] ={
        in: 'body',
        description: 'Add User',
        schema: {
          "id": "",
          "title": "",
        }
    }
  */

    try {
        const { id, title } = req.body;
        const result = await stateService.updateStateService(id, title);
        return res.status(200).json({
            success: true,
            message: "Update state successfully.",
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};

exports.deleteStateController = async (req, res) => {
    /*
    #swagger.tags = ['Common']

    #swagger.description = 'Delete state.'
    #swagger.parameters['body'] ={
        in: 'body',
        description: 'Add User',
        schema: {
          "id": "",
        }
    }
  */

    try {
        const { id } = req.body;
        const result = await stateService.deleteStateService(id);
        return res.status(200).json({
            success: true,
            message: "Delete state successfully.",
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};

// City Controller
exports.getCityController = async (req, res) => {
    /*
    #swagger.tags = ['Common']

    #swagger.description = 'Get city list.'

    #swagger.parameters['id'] = {
        in: 'path',
        description: 'State Primary Id (uuid)',
        required: true,
        type: 'string',
        format: 'uuid'
    }
    */

    try {
        const { data, total } = await cityService.getCityByStateIdService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Get cities successfully.",
            data,
            metadata: {
                total_count: total,
            },
        });
    } catch (error) {
        console.log(error);

        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};

exports.addCityController = async (req, res) => {
    /*
    #swagger.tags = ['Common']

    #swagger.description = 'Add city.'
    #swagger.parameters['body'] ={
        in: 'body',
        description: 'Add User',
        schema: {
          "title": "",
          "state_id": "",
        }
    }
  */

    try {
        const { title, state_id } = req.body;
        const result = await cityService.addCityService(title, state_id);
        return res.status(201).json({
            success: true,
            message: "Add city successfully.",
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};

exports.activeInactiveCityController = async (req, res) => {
    /*
    #swagger.tags = ['Common']

    #swagger.description = 'Active/Inactive city.'
    #swagger.parameters['body'] ={
        in: 'body',
        description: 'Add User',
        schema: {
          "id": "",
          "is_active": true,
        }
    }
  */

    try {
        const { id, is_active } = req.body;
        const result = await cityService.activeInactiveCityService(id, is_active);
        return res.status(200).json({
            success: true,
            message: `City ${is_active ? "activated" : "deactivated"} successfully.`,
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};

exports.upsertCityController = async (req, res) => {
    /*
    #swagger.tags = ['Common']

    #swagger.description = 'Upsert city.'
    #swagger.parameters['body'] ={
        in: 'body',
        description: 'In that object you have to pass an array of city objects. Each city object should have the following properties: title, state_id. if id present then it will update the city. else it will create a new city.',
        schema: {
          "city_array": [
            {
              "id": "",
              "title": "",
              "state_id": ""
            },
            {
              "title": "",
              "state_id": ""
            }
          ]
        }
    }
  */

    try {
        const { city_array } = req.body;
        const result = await cityService.upsertCityService(city_array);
        return res.status(201).json({
            success: true,
            message: "Upsert city successfully.",
            data: result,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};

exports.deleteCityController = async (req, res) => {
    /*
    #swagger.tags = ['Common']

    #swagger.description = 'Delete city.'
        #swagger.parameters['body'] ={
        in: 'body',
        description: 'delete city by id.',
        schema: {
          "id": "",
        }
    }
  */

    try {
        const { id } = req.body;
        const result = await cityService.deleteCityService(id);
        return res.status(200).json({
            success: true,
            message: "Delete city successfully.",
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};
