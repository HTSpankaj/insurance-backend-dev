const MobileBannerDatabase = require("../../../infrastructure/databases/config/mobile_banner.database");
const BucketNameStorage = require("../../../infrastructure/storage/bucketName.storage");

class MobileBannerService {
    /**
     * Constructor for initializing the MobileBannerService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.mobileBannerDatabase = new MobileBannerDatabase(supabaseInstance);
        this.configStorage = new BucketNameStorage(supabaseInstance, "config");
    }

    async getMobileBannerService(is_active) {
        return await this.mobileBannerDatabase.getMobileBannerDatabase(is_active);
    }

    async insertUpdateMobileBannerService(id, title, description, is_active, file=null) {
        let mobileBannerDatabaseResponse = null;

        if (id) {
            mobileBannerDatabaseResponse = await this.mobileBannerDatabase.updateMobileBannerDatabase(
                mobileBannerDatabaseResponse?.id, title, description, is_active, null
            );
        } else {
            mobileBannerDatabaseResponse = await this.mobileBannerDatabase.insertMobileBannerDatabase(title, description, is_active);
        }
        if (mobileBannerDatabaseResponse?.id && file) {
            const fileExtension = file.mimetype.split("/")[1];
            const filePath = `mobile_banner/${mobileBannerDatabaseResponse?.id}/banner.${fileExtension}`;

            const uploadFileResponse = await this.storage.uploadFile(
                filePath,
                file.buffer,
                file.mimetype,
                false,
            );
            if (uploadFileResponse) {
                const banner_url = await this.storage.getPublicUrl(uploadFileResponse?.path+"?" + new Date().getTime());
                mobileBannerDatabaseResponse = await this.mobileBannerDatabase.updateMobileBannerDatabase   (
                    mobileBannerDatabaseResponse?.id, null, null, null, banner_url
                );
            }
        }
        return mobileBannerDatabaseResponse;
    }
}

module.exports = MobileBannerService;
