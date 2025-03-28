class BucketNameStorage {
    constructor(db, bucketName) {
        this.db = db;
        this.bucketName = bucketName;
    }

    async uploadFile(filePath, imageBuffer, contentType) {
        const { data, error } = await this.db.storage
            .from(this.bucketName)
            .upload(filePath, imageBuffer, {
                cacheControl: "3600",
                upsert: false,
                contentType: contentType,
            });
        if (data?.path) {
            return data;
        } else {
            throw error.message || error;
        }
    }

    async getPublicUrl(filePath) {
        const urlRes = await this.db.storage.from(this.bucketName).getPublicUrl(filePath);
        if (urlRes?.data?.publicUrl) {
            return urlRes?.data?.publicUrl;
        } else {
            throw urlRes;
        }
    }

    async deleteFile(filePath) {
        const { error } = await this.db.storage.from(this.bucketName).remove([filePath]);
        if (error) throw error;
    }
}

module.exports = BucketNameStorage;
