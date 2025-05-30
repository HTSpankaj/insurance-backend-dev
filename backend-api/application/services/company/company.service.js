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
        is_auto_assign_rm,
        logo_file,
        irdai_license_file,
        terms_of_agreement_file,
        business_certification_file,
        created_by_user_id,
    ) {
        try {
            // First, create the company without the logo_url
            const company = await this.companyDatabase.createCompany(
                company_name,
                name,
                email,
                contact_person,
                irdai_license_number,
                tax_gstin_number,
                is_publish,
                is_auto_assign_rm,
                null, // Temporarily set logo_url to null
                created_by_user_id,
            );

            // Upload files to Supabase bucket under company/<company_id>/document/
            const uploadFile = async (file, fileName) => {
                const fileExtension = file.mimetype.split("/")[1];
                const filePath = `${company.company_id}/document/${fileName}.${fileExtension}`; // Use actual company_id
                console.log("Uploading file to:", `company/${filePath}`);
                const { data, error } = await this.storage.uploadFile(
                    filePath,
                    file.buffer,
                    file.mimetype,
                    false,
                );
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

            // Update the company with the logo_url using CompanyDatabase
            const updatedCompany = await this.companyDatabase.updateCompanyLogo(
                company.company_id,
                logo_url,
            );

            // Insert file URLs into company_supporting_document table
            await this.companyDatabase.createSupportingDocuments(
                company.company_id,
                irdai_license_url,
                terms_of_agreement_url,
                business_certification_url,
            );

            return {
                ...updatedCompany,
                irdai_license_url,
                terms_of_agreement_url,
                business_certification_url,
            };
        } catch (error) {
            console.error("Error in createCompany:", error);
            throw new Error(`Failed to create company: ${error.message || JSON.stringify(error)}`);
        }
    }

    async checkCompanyService(company_name) {
        return this.companyDatabase.checkCompanyDatabase(company_name);
    }

    async updateCompany(
        company_id,
        company_name,
        name,
        email,
        contact_person,
        irdai_license_number,
        tax_gstin_number,
        is_publish,
        is_auto_assign_rm,
        logo_file,
        irdai_license_file,
        terms_of_agreement_file,
        business_certification_file,
        created_by_user_id,
    ) {
        try {
            // First, create the company without the logo_url
            const company = await this.companyDatabase.updateCompany(
                company_id,
                company_name,
                name,
                email,
                contact_person,
                irdai_license_number,
                tax_gstin_number,
                is_publish,
                is_auto_assign_rm,
                created_by_user_id,
            );

            // Upload files to Supabase bucket under company/<company_id>/document/
            const uploadFile = async (file, fileName) => {
                const fileExtension = file.mimetype.split("/")[1];
                const filePath = `${company.company_id}/document/${fileName}.${fileExtension}`; // Use actual company_id
                console.log("Uploading file to:", `company/${filePath}`);
                const { data, error } = await this.storage.uploadFile(
                    filePath,
                    file.buffer,
                    file.mimetype,
                    true,
                );
                if (error) throw error;
                return this.storage.getPublicUrl(filePath);
            };

            let logo_url = null;
            let irdai_license_url = null;
            let terms_of_agreement_url = null;
            let business_certification_url = null;

            if (logo_file) {
                logo_url = await uploadFile(logo_file, "logo");
            }
            if (irdai_license_file) {
                irdai_license_url = await uploadFile(irdai_license_file, "irdai_license");
            }
            if (terms_of_agreement_file) {
                terms_of_agreement_url = await uploadFile(
                    terms_of_agreement_file,
                    "terms_of_agreement",
                );
            }
            if (business_certification_file) {
                business_certification_url = await uploadFile(
                    business_certification_file,
                    "business_certification",
                );
            }

            let updatedCompany = {};
            if (logo_url) {
                updatedCompany = await this.companyDatabase.updateCompanyLogo(company_id, logo_url);
            }

            if (irdai_license_url || terms_of_agreement_url || business_certification_url) {
                await this.companyDatabase.updateSupportingDocuments(
                    company_id,
                    irdai_license_url,
                    terms_of_agreement_url,
                    business_certification_url,
                );
            }

            return {
                ...company,
                ...updatedCompany,
            };
        } catch (error) {
            console.error("Error in createCompany:", error);
            throw new Error(`Failed to create company: ${error.message || JSON.stringify(error)}`);
        }
    }

    async getCompanyDetailsByCompanyIdService(company_id) {
        try {
            return await this.companyDatabase.getCompanyDetailsByCompanyIdDatabase(company_id);
        } catch (error) {
            console.error("Error in getCompanyDetailsByCompanyIdService:", error);
            throw new Error(
                `Failed to get company details by company_id: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getCompanyList(pageNumber, limit, search, is_all, is_publish) {
        try {
            const { data, total_count } = await this.companyDatabase.getCompaniesWithStats(
                pageNumber,
                limit,
                search,
                is_all,
                is_publish,
            );
            const total_pages = Math.ceil(total_count / limit);

            return {
                data,
                metadata: {
                    total_count: total_count,
                    current_page_count: data?.length || 0,
                    ...(!is_all
                        ? {
                              page: pageNumber,
                              per_page: limit,
                              total_pages,
                          }
                        : {}),
                },
            };
        } catch (error) {
            console.error("Error in getCompanyList:", error);
            throw new Error(
                `Failed to fetch company list: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async getConvertedLeadsByCompanyId(companyId, pageNumber, limit) {
        try {
            const { data, total_count } = await this.companyDatabase.getConvertedLeadsByCompanyId(
                companyId,
                pageNumber,
                limit,
            );
            const total_pages = Math.ceil(total_count / limit);

            return {
                data,
                metadata: {
                    page: pageNumber,
                    per_page: limit,
                    total_count,
                    total_pages,
                },
            };
        } catch (error) {
            console.error("Error in getConvertedLeadsByCompanyId:", error);
            throw new Error(
                `Failed to fetch converted leads: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
    async getCompanyDetailsByIdWithStatistics(companyId) {
        try {
            const data = await this.companyDatabase.getCompanyDetailsByIdWithStatistics(companyId);
            return {
                company_id: data.company_id, // Add company_id
                company_display_id: data.company_display_id, // Add company_display_id
                company_name: data.company_name,
                contact_person: data.contact_person, // Already cast to TEXT in RPC
                email: data.email,
                logo_url: data.logo_url,
                no_of_products: Number(data.no_of_products) || 0,
                converted_leads: Number(data.converted_leads) || 0,
                total_earnings: Number(data.total_earnings) || 0,
                received_earnings: Number(data.received_earnings) || 0,
                pending_earnings: Number(data.pending_earnings) || 0,
            };
        } catch (error) {
            console.error("Error in getCompanyDetailsByIdWithStatistics:", error);
            throw new Error(
                `Failed to fetch company details: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
}

module.exports = CompanyService;
