const systemSchemeMongoose = [
    "v_placeholder",
    "v_type",
    "v_data_route",
    "v_form_name",
    "v_form_key",
    "v_form_disable",
    "v_mixed",
    "v_select_data"
];

const systemScheme = [
    "v_placeholder",
    "v_type",
    "v_data_route",
    "v_form_name",
    "v_form_key",
    "v_form_disable",
    "v_select_data",
    "v_mixed",
    "min",
    "max",
    "required"
];

class SchemeHelper {
    async mapToMongooseScheme(MainScheme) {
        systemSchemeMongoose.forEach(ssm => {
            Object.keys(MainScheme).map(schemes => {
                Object.keys(MainScheme[schemes]).map(scheme => {
                    if (scheme === ssm) {
                        delete MainScheme[schemes][scheme]
                    }
                })
            })
        });
        return MainScheme
    }

    async mapToSystemScheme(MainScheme) {
        // console.log(MainScheme)
        const NewMainScheme = [];
        Object.keys(MainScheme).forEach(schemes => {
            const NewScheme = {};
            Object.keys(MainScheme[schemes]).forEach(scheme => {
                systemScheme.forEach(ss => {
                    if (ss === scheme) {
                        NewScheme[scheme] = MainScheme[schemes][scheme]
                    }
                })
            });
            NewMainScheme.push(NewScheme)
        });
        // console.log(NewMainScheme)

        return NewMainScheme
    }
}
module.exports = SchemeHelper;
