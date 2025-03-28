const CompanyDatabase = require("../../../infrastructure/databases/company/company.database");
const BucketNameStorage = require("../../../infrastructure/storage/bucketName.storage.js");

class CompanyService {
    constructor(supabaseInstance) {
        this.companyDatabase = new CompanyDatabase(supabaseInstance);
        this.storage = new BucketNameStorage(supabaseInstance, "company"); // Bucket named 'company'
    }

    async createCompany(
        company_name,
        name,
        email,
        contact_person,
        irdai_license_number,
        tax_gstin_number,
        is_publish,
        logo_file,
        irdai_license_file,
        terms_of_agreement_file,
        business_certification_file,
    ) {
        try {
            // Insert into company table
            const company = await this.companyDatabase.createCompany(
                company_name,
                name,
                email,
                contact_person,
                irdai_license_number,
                tax_gstin_number,
                is_publish,
            );

            // Upload files to Supabase bucket under company/<company_id>/document/
            const uploadFile = async (file, fileName) => {
                const fileExtension = file.mimetype.split("/")[1];
                const filePath = `/company_id/document/${fileName}-${Date.now()}.${fileExtension}`; // Updated path
                console.log("Uploading file to:", `company/${filePath}`);
                const { data, error } = await this.storage.uploadFile(filePath, file.buffer);
                if (error) throw error;
                return this.storage.getPublicUrl(filePath);
            };

            const logo_url = await uploadFile(logo_file, "logo");
            const irdai_license_url = await uploadFile(irdai_license_file, "irdai_license");
            const terms_of_agreement_url = await uploadFile(
                terms_of_agreement_file,
                "terms_of_agreement",
            );
            const business_certification_url = await uploadFile(
                business_certification_file,
                "business_certification",
            );

            // Insert file URLs into company_supporting_document table
            await this.companyDatabase.createSupportingDocuments(
                company.company_id,
                logo_url,
                irdai_license_url,
                terms_of_agreement_url,
                business_certification_url,
            );

            return {
                ...company,
                logo_url,
                irdai_license_url,
                terms_of_agreement_url,
                business_certification_url,
            };
        } catch (error) {
            console.error("Error in createCompany:", error);
            throw new Error(`Failed to create company: ${error.message || JSON.stringify(error)}`);
        }
    }
}

module.exports = CompanyService;
