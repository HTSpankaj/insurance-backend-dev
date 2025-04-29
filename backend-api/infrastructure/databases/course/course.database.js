const { SupabaseClient } = require("@supabase/supabase-js");

const courseTableName = "course";
const course_sub_category_relationTableName = "course_sub_category_relation";

class CourseDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async createCourse(
        title,
        description,
        category_id,
        su_category_id_array = [],
        access_for_all_user,
        access_for_verified_user,
        availability_schedule,
        schedule_date,
        status,
    ) {
        try {
            const { data, error } = await this.db
                .from(courseTableName)
                .insert({
                    title,
                    description,
                    category_id,
                    access_for_all_user,
                    access_for_verified_user,
                    availability_schedule,
                    schedule_date,
                    status,
                })
                .select()
                .maybeSingle();

            if (error) throw error;

            if (data) {
                await this.db.from(course_sub_category_relationTableName).insert(
                    su_category_id_array.map(su_category_id => {
                        return {
                            course_id: data.id,
                            sub_category_id: su_category_id,
                        };
                    }),
                );
            }

            return data;
        } catch (error) {
            console.error("Error in createCourse:", error);
            throw new Error(`Failed to create course: ${error.message || JSON.stringify(error)}`);
        }
    }

    async updateCourse(
        id,
        title,
        description,
        category_id,
        su_category_id_array = [],
        access_for_all_user,
        access_for_verified_user,
        availability_schedule,
        schedule_date,
        status,
    ) {
        try {
            const { data, error } = await this.db
                .from(courseTableName)
                .update({
                    title,
                    description,
                    category_id,
                    access_for_all_user,
                    access_for_verified_user,
                    availability_schedule,
                    schedule_date,
                    status,
                })
                .eq("id", id)
                .select()
                .maybeSingle();

            if (error) throw error;

            if (data) {
                await this.db
                    .from(course_sub_category_relationTableName)
                    .delete()
                    .eq("course_id", id);
                await this.db.from(course_sub_category_relationTableName).insert(
                    su_category_id_array.map(su_category_id => {
                        return {
                            course_id: data.id,
                            sub_category_id: su_category_id,
                        };
                    }),
                );
            }
            return data;
        } catch (error) {
            console.error("Error in createCourse:", error);
            throw new Error(`Failed to create course: ${error.message || JSON.stringify(error)}`);
        }
    }

    async updateCourseBanner(course_id, course_banner_img_url) {
        try {
            const { data, error } = await this.db
                .from(courseTableName)
                .update({
                    course_banner_img_url: course_banner_img_url + "?" + Date.now(),
                })
                .eq("id", course_id)
                .select()
                .maybeSingle();

            if (error) throw error;
            if (!data) throw new Error("Course not found");

            return data;
        } catch (error) {
            console.error("Error in updateCourseBanner:", error);
            throw new Error(
                `Failed to update course banner URL: ${error.message || JSON.stringify(error)}`,
            );
        }
    }

    async deleteCourse(courseId) {
        try {
            const { data, error } = await this.db
                .from(courseTableName)
                .update({ is_delete: true })
                .eq("id", courseId)
                .select()
                .maybeSingle();

            if (error) {
                console.error("Supabase error in deleteCourse:", error);
                throw error;
            }

            if (!data) {
                throw new Error("Course not found");
            }

            return data;
        } catch (error) {
            console.error("Error in deleteCourse:", error);
            throw new Error(`Failed to delete course: ${error.message || JSON.stringify(error)}`);
        }
    }

    async getCourseList({ pageNumber, limit, status, categoryId, search }) {
        try {
            let query = this.db
                .from(courseTableName) // Fix: Use courseTableName
                .select(
                    `id, title, status, is_delete,description, category_id(category_id, title), course_banner_img_url, created_at, course_module(count),
                    sub_category:course_sub_category_relation(sub_category_id(sub_category_id, title))
                    `,
                    { count: "exact" },
                )
                .eq("is_delete", false)
                .order("created_at", { ascending: false });

            if (status && status !== "") {
                query = query.eq("status", status);
            }
            if (categoryId && categoryId !== "") {
                query = query.eq("category_id", categoryId);
            }
            if (search && search.trim() !== "") {
                query = query.ilike("title", `%${search}%`);
            }

            const from = (pageNumber - 1) * limit;
            const to = from + limit - 1;
            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) {
                console.error("Supabase error in getCourseList:", error);
                throw error;
            }

            return { data, totalCount: count };
        } catch (error) {
            console.error("Error in getCourseList:", error);
            throw new Error(
                `Failed to fetch course list: ${error.message || JSON.stringify(error)}`,
            );
        }
    }
}

module.exports = CourseDatabase;
