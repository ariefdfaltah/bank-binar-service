const collection = require('mongoose');
const Schema = collection.Schema;

const basicScheme = {
    address : [
        {
            required: true,
            v_form_name: "Nama Jalan",
            v_form_key: "street",
            v_form_disable: false,
            v_placeholder: "Nama Jalan Rujukan",
            v_type: "input",
            v_data_route: ""
        },
        {
            required: false,
            v_form_name: "Kodepos",
            v_form_key: "zipcode",
            v_form_disable: false,
            v_placeholder: "Kodepos",
            v_type: "input",
            v_data_route: ""
        },
        {
            required: true,
            v_form_name: "Kelurahan",
            v_form_key: "sub_district",
            v_form_disable: false,
            v_placeholder: "Kelurahan",
            // v_type: "select",
            // v_data_route: "/area/subdistrict/year?"
            v_type: "input",
            v_data_route: ""
        },
        {
            required: true,
            v_form_name: "Kecamatan",
            v_form_key: "district",
            v_form_disable: true,
            v_placeholder: "Kelurahan",
            v_type: "input",
            v_data_route: ""
        },
        {
            required: true,
            v_form_name: "Kabupaten / Kota",
            v_form_key: "city",
            v_form_disable: true,
            v_placeholder: "Kabupaten / Kota",
            v_type: "input",
            v_data_route: ""
        },
        {
            required: true,
            v_form_name: "Provinsi",
            v_form_key: "province",
            v_form_disable: true,
            v_placeholder: "Provinsi",
            v_type: "input",
            v_data_route: ""
        }
    ]
};

const basicData = {
    nip: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        v_form_name: "NIP",
        v_form_key: "nip",
        v_form_disable: false,
        v_placeholder: "Nomor Induk Pegawai",
        v_type: "input",
        v_data_route: ""
    },
    npsn: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        v_form_name: "NPSN",
        v_form_key: "npsn",
        v_form_disable: false,
        v_placeholder: "Nomor Pokok Sekolah Nasional",
        v_type: "input",
        v_data_route: ""
    },
    nss: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        v_form_name: "NSS",
        v_form_key: "nss",
        v_form_disable: false,
        v_placeholder: "Nomor Statistik Sekolah",
        v_type: "input",
        v_data_route: ""
    },
    nik: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        v_form_name: "NIK",
        v_form_key: "nik",
        v_form_disable: false,
        v_placeholder: "Nomor Induk Kependudukan",
        v_type: "input",
        v_data_route: ""
    },
    nisn: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        v_form_name: "NISN",
        v_form_key: "nisn",
        v_form_disable: false,
        v_placeholder: "Nomor Induk Siswa Nasional",
        v_type: "input",
        v_data_route: ""
    },
    name_default: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        v_form_name: "Nama",
        v_form_key: "name",
        v_form_disable: false,
        v_placeholder: "Nama",
        v_type: "input",
        v_data_route: ""
    },
    name: (entity) => {
        return {
            type: String,
            required: true,
            max: 255,
            min: 6,
            v_form_name: `Nama ${entity}`,
            v_form_key: "name",
            v_form_disable: false,
            v_placeholder: `Nama ${entity}`,
            v_type: "input",
            v_data_route: ""
        }
    },
    code: (entity) => {
        return {
            type: String,
            required: true,
            max: 10,
            min: 1,
            v_form_name: `Kode ${entity}`,
            v_form_key: "code",
            v_form_disable: false,
            v_placeholder: `Kode ${entity}`,
            v_type: "input",
            v_data_route: ""
        }
    },
    account_number: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        v_form_name: "Nomor Akun",
        v_form_key: "account_number",
        v_form_disable: false,
        v_placeholder: "Nomor Akun",
        v_type: "input",
        v_data_route: ""
    },
    transaction_pin: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        v_form_name: "PIN Transaksi",
        v_form_key: "transaction_pin",
        v_form_disable: false,
        v_placeholder: "PIN Transaksi",
        v_type: "input",
        v_data_route: ""
    },
    no_sk: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        v_form_name: "Nomor SK",
        v_form_key: "no_sk",
        v_form_disable: false,
        v_placeholder: "Nomor SK",
        v_type: "input",
        v_data_route: ""
    },
    no_kip: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        v_form_name: "Nomor KIP",
        v_form_key: "no_kip",
        v_form_disable: false,
        v_placeholder: "Nomor KIP",
        v_type: "input",
        v_data_route: ""
    },
    parent_nik: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        v_form_name: "Nomor NIK Orang Tua",
        v_form_key: "parent_nik",
        v_form_disable: false,
        v_placeholder: "Nomor NIK Orang Tua",
        v_type: "input",
        v_data_route: ""
    },
    appointment_date: {
        type: Date,
        required: true,
        v_form_name: "Tanggal Pengangkatan",
        v_form_key: "appointment_date",
        v_form_disable: false,
        v_placeholder: "Tanggal Pengangkatan",
        v_type: "date",
        v_data_route: ""
    },
    pns_date: {
        type: Date,
        required: true,
        v_form_name: "Tanggal Pengangkatan PNS",
        v_form_key: "pns_date",
        v_form_disable: false,
        v_placeholder: "Tanggal Pengangkatan PNS",
        v_type: "date",
        v_data_route: ""
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        v_form_name: "Email",
        v_form_key: "email",
        v_form_disable: false,
        v_placeholder: "Email",
        v_type: "input",
        v_data_route: ""
    },
    description: {
        type: String,
        required: false,
        max: 1024,
        min: 6,
        v_form_name: "Deskripsi",
        v_form_disable: false,
        v_form_key: "description",
        v_placeholder: "Deskripsi",
        v_type: "text",
        v_data_route: ""
    },
    custom_string: (entity, key) => {
        return {
            type: String,
            required: true,
            max: 10,
            min: 1,
            v_form_name: `${entity}`,
            v_form_key: `${key}`,
            v_form_disable: false,
            v_placeholder: `${entity}`,
            v_type: "input",
            v_data_route: ""
        }
    },
    custom_number: (entity, key) => {
        return {
            type: Number,
            required: true,
            v_form_name: `${entity}`,
            v_form_key: `${key}`,
            v_form_disable: false,
            v_placeholder: `${entity}`,
            v_type: "input",
            v_data_route: ""
        }
    },
    gender: {
        type: String,
        required: true,
        max: 5,
        min: 20,
        v_form_name: "Jenis Kelamin",
        v_form_disable: false,
        v_form_key: "gender",
        v_placeholder: "Jenis Kelamin",
        v_type: "selectwithdata",
        v_data_route: "",
        v_select_data: ["Pria", "Wanita"]
    },
    day: {
        type: Number,
        required: true,
        max: 5,
        min: 20,
        v_form_name: "Hari",
        v_form_disable: false,
        v_form_key: "day",
        v_placeholder: "Hari",
        v_type: "selectwithdataobject",
        v_data_route: "",
        v_select_data: [{"key": 0, "value": "Minggu"},{"key": 1, "value": "Senin"},{"key": 2, "value": "Selasa"},{"key": 3, "value": "Rabu"},{"key": 4, "value": "Kamis"},{"key": 5, "value": "Jum'at"},{"key": 6, "value": "Sabtu"},]
    },
    status_induk: {
        type: String,
        required: true,
        max: 5,
        min: 20,
        v_form_name: "Status Guru Induk",
        v_form_disable: false,
        v_form_key: "status_induk",
        v_placeholder: "Status Guru Induk",
        v_type: "selectwithdata",
        v_data_route: "",
        v_select_data: ["Induk", "Bukan Induk"]
    },
    kip_status: {
        type: String,
        required: true,
        max: 5,
        min: 20,
        v_form_name: "Status Penerima KIP",
        v_form_disable: false,
        v_form_key: "kip_status",
        v_placeholder: "Status Penerima KIP",
        v_type: "selectwithdata",
        v_data_route: "",
        v_select_data: ["Penerima", "Bukan Penerima"]
    },
    birth_date: {
        type: Date,
        required: true,
        max: 5,
        min: 20,
        v_form_name: "Tanggal Lahir",
        v_form_disable: false,
        v_form_key: "birth_date",
        v_placeholder: "Tanggal Lahir",
        v_type: "date",
        v_data_route: ""
    },
    phone: {
        type: String,
        required: true,
        max: 5,
        min: 20,
        v_form_name: "Nomor Telepon",
        v_form_disable: false,
        v_form_key: "phone",
        v_placeholder: "Nomor Telepon",
        v_type: "input",
        v_data_route: ""
    },
    address : (entity) => {
        return {
            type: Schema.Types.Mixed,
            required: false,
            max: 1024,
            min: 6,
            v_form_name: `Alamat ${entity}`,
            v_form_key: "address",
            v_form_disable: false,
            v_placeholder: `Alamat ${entity}`,
            v_type: "mixed",
            v_data_route: "",
            v_mixed: basicScheme.address
        }
    },
    start_date: {
        type: Date,
        required: true,
        v_form_name: "Tanggal Mulai",
        v_form_key: "start_date",
        v_form_disable: false,
        v_placeholder: "Tanggal Mulai",
        v_type: "daterange",
        v_data_route: ""
    },
    start_date_custom : (entity, type) => {
        return {
            type: Date,
            required: true,
            v_form_name: entity,
            v_form_key: "start_date",
            v_form_disable: false,
            v_placeholder: entity,
            v_type: type,
            v_data_route: ""
        }
    },
    end_date: {
        type: Date,
        required: true,
        v_form_name: "Tanggal Selesai",
        v_form_key: "end_date",
        v_form_disable: false,
        v_placeholder: "Tanggal Selesai",
        v_type: "daterange",
        v_data_route: ""
    },
    end_date_custom : (entity, type) => {
        return {
            type: Date,
            required: true,
            v_form_name: entity,
            v_form_key: "end_date",
            v_form_disable: false,
            v_placeholder: entity,
            v_type: type,
            v_data_route: ""
        }
    },
    website: {
        type: String,
        required: true,
        max: 5,
        min: 255,
        v_form_name: "Alamat Website",
        v_form_disable: false,
        v_form_key: "website",
        v_placeholder: "Alamat Website",
        v_type: "input",
        v_data_route: ""
    },
    latitude: {
        type: String,
        required: true,
        max: 5,
        min: 255,
        v_form_name: "Koordinat Lintang",
        v_form_disable: false,
        v_form_key: "latitude",
        v_placeholder: "Koordinat Lintang",
        v_type: "input",
        v_data_route: ""
    },
    longitude: {
        type: String,
        required: true,
        max: 5,
        min: 255,
        v_form_name: "Koordinat Bujur",
        v_form_disable: false,
        v_form_key: "longitude",
        v_placeholder: "Koordinat Bujur",
        v_type: "input",
        v_data_route: ""
    },
    username: {
        type: String,
        required: true,
        max: 8,
        min: 255,
        v_form_name: "Username",
        v_form_disable: false,
        v_form_key: "username",
        v_placeholder: "Username",
        v_type: "input",
        v_data_route: ""
    },
    secret_key: {
        type: String,
        required: true,
        max: 8,
        min: 255,
        v_form_name: "Secret Key",
        v_form_disable: true,
        v_form_key: "secret_key",
        v_placeholder: "Secret Key",
        v_type: "input",
        v_data_route: ""
    },
    public_key: {
        type: String,
        required: true,
        max: 8,
        min: 255,
        v_form_name: "Public Key",
        v_form_disable: true,
        v_form_key: "public_key",
        v_placeholder: "Public Key",
        v_type: "input",
        v_data_route: ""
    },
    password: {
        type: String,
        required: true,
        max: 255,
        min: 8,
        v_form_name: "Password",
        v_form_disable: false,
        v_form_key: "password",
        v_placeholder: "Password",
        v_type: "input",
        v_data_route: ""
    },
    status: {
        type: Number,
        required: false,
        v_form_name: "Status",
        v_form_disable: false,
        v_form_key: "status",
        v_placeholder: "Status",
        v_type: "input",
        v_data_route: ""
    },
    route: {
        type: String,
        required: false,
        v_form_name: "Route",
        v_form_disable: false,
        v_form_key: "route",
        v_placeholder: "Route",
        v_type: "input",
        v_data_route: ""
    },
    level: {
        type: Number,
        required: true,
        v_form_name: "Level",
        v_form_disable: false,
        v_form_key: "level",
        v_placeholder: "Level",
        v_type: "input",
        v_data_route: ""
    },
    data: {
        type: [Schema.Types.Mixed],
        required: true,
        v_form_name: "Data",
        v_form_disable: false,
        v_form_key: "data",
        v_placeholder: "Data",
        v_type: "richtext",
        v_data_route: ""
    },
    roles: {
        type: [Schema.Types.Mixed],
        required: true,
        v_form_name: "Hak Akses",
        v_form_disable: false,
        v_form_key: "roles",
        v_placeholder: "Hak Akses Rujukan",
        v_type: "roles",
        v_data_route: "/system/role?"
    },
    scheduled_at: {
        type: Date,
        required: true,
        v_form_name: "Dijadwalkan Pada",
        v_form_disable: false,
        v_form_key: "scheduled_at",
        v_placeholder: "Dijadwalkan Pada",
        v_type: "datetime",
        v_data_route: ""
    },
    finish_at: {
        type: Date,
        required: true,
        v_form_name: "Dijadwalkan Selesai Pada",
        v_form_disable: false,
        v_form_key: "finish_at",
        v_placeholder: "Dijadwalkan Pada Selesai",
        v_type: "datetime",
        v_data_route: ""
    },
    schedule_position: {
        type: Number,
        required: true,
        v_form_name: "Posisi Jadwal Pada Jam Ke",
        v_form_disable: false,
        v_form_key: "schedule_position",
        v_placeholder: "Posisi Jadwal Pada Jam Ke",
        v_type: "input",
        v_data_route: ""
    },
    school : {
        required: true,
        v_form_name: "Nama Sekolah",
        v_form_key: "school",
        v_form_disable: false,
        v_placeholder: "Nama Sekolah Rujukan",
        v_type: "select",
        v_data_route: "/school?"
    },
    application : {
        required: true,
        v_form_name: "Aplikasi",
        v_form_key: "application",
        v_form_disable: false,
        v_placeholder: "Nama Aplikasi Rujukan",
        v_type: "select",
        v_data_route: "/application?"
    },
    school_generation : {
        required: true,
        v_form_name: "Tahun Ajaran",
        v_form_key: "school_generation",
        v_form_disable: false,
        v_placeholder: "Tahun Ajaran Rujukan",
        v_type: "select",
        v_data_route: "/school/year?"
    },
    curriculum : {
        required: true,
        v_form_name: "Kurikulum",
        v_form_key: "curriculum",
        v_form_disable: false,
        v_placeholder: "Kurikulum Rujukan",
        v_type: "select",
        v_data_route: "/curriculum?"
    },
    grade : {
        required: true,
        v_form_name: "Tingkat",
        v_form_key: "grade",
        v_form_disable: false,
        v_placeholder: "Tingkat Rujukan",
        v_type: "select",
        v_data_route: "/grade?"
    },
    employee_status : {
        required: true,
        v_form_name: "Status Kepegawaian",
        v_form_key: "employee_status",
        v_form_disable: false,
        v_placeholder: "Status Kepegawaian",
        v_type: "select",
        v_data_route: "/employee/status?"
    },
    major : {
        required: true,
        v_form_name: "Jurusan",
        v_form_key: "major",
        v_form_disable: false,
        v_placeholder: "Jurusan Rujukan",
        v_type: "select",
        v_data_route: "/major?"
    },
    subject : {
        required: true,
        v_form_name: "Mata Pelajaran",
        v_form_key: "subject",
        v_form_disable: false,
        v_placeholder: "Mata Pelajaran",
        v_type: "select",
        v_data_route: "/subject?"
    },
    semester : {
        required: true,
        v_form_name: "Semester",
        v_form_key: "semester",
        v_form_disable: false,
        v_placeholder: "Semester Rujukan",
        v_type: "select",
        v_data_route: "/semester?"
    },
    class : {
        required: true,
        v_form_name: "Kelas",
        v_form_key: "class",
        v_form_disable: false,
        v_placeholder: "Kelas Rujukan",
        v_type: "select",
        v_data_route: "/class?"
    },
    teacher : {
        required: true,
        v_form_name: "Nama Guru",
        v_form_key: "teacher",
        v_form_disable: false,
        v_placeholder: "Nama Guru Rujukan",
        v_type: "select",
        v_data_route: "/teacher?"
    },
    teacher_class : {
        required: true,
        v_form_name: "Nama Guru Wali kelas",
        v_form_key: "teacher_class",
        v_form_disable: false,
        v_placeholder: "Nama Guru Wali kelas Rujukan",
        v_type: "select",
        v_data_route: "/teacher?"
    },
    study_group: {
        required: true,
        v_form_name: "Rombongan Belajar",
        v_form_key: "study_group",
        v_form_disable: false,
        v_placeholder: "Rombongan Belajar Rujukan",
        v_type: "select",
        v_data_route: "/study/group?"
    },
    role: {
        required: true,
        v_form_name: "Hak Akses",
        v_form_key: "role",
        v_form_disable: false,
        v_placeholder: "Hak Akses Rujukan",
        v_type: "select",
        v_data_route: "/role?"
    },
    school_education_type: {
        required: true,
        v_form_name: "Jenis Pendidikan",
        v_form_key: "school_education_type",
        v_form_disable: false,
        v_placeholder: "Jenis Pendidikan Rujukan",
        v_type: "select",
        v_data_route: "/school/education/type?"
    },
    school_type: {
        required: true,
        v_form_name: "Tipe Sekolah",
        v_form_key: "school_type",
        v_form_disable: false,
        v_placeholder: "Tipe Sekolah Rujukan",
        v_type: "select",
        v_data_route: "/school/type?"
    },
    school_special_need: {
        required: true,
        v_form_name: "Sekolah Berkebutuhan Khusus",
        v_form_key: "school_special_need",
        v_form_disable: false,
        v_placeholder: "Sekolah Berkebutuhan Khusus Rujukan",
        v_type: "select",
        v_data_route: "/school/special/need?"
    },
    religion: {
        required: true,
        v_form_name: "Agama",
        v_form_key: "religion",
        v_form_disable: false,
        v_placeholder: "Agama",
        v_type: "select",
        v_data_route: "/religion?"
    },
    study_group_member: {
        required: true,
        v_form_name: "Rombongan Belajar",
        v_form_key: "study_group_member",
        v_form_disable: false,
        v_placeholder: "Rombongan Belajar",
        v_type: "select",
        v_data_route: "/study/group/member?"
    },
    schedule_generate: {
        required: true,
        v_form_name: "Jadwal",
        v_form_key: "schedule_generate",
        v_form_disable: false,
        v_placeholder: "Jadwal",
        v_type: "select",
        v_data_route: "/schedule/generate?"
    },
    schedule: {
        required: true,
        v_form_name: "Jadwal",
        v_form_key: "schedule",
        v_form_disable: false,
        v_placeholder: "Jadwal",
        v_type: "select",
        v_data_route: "/schedule?"
    },
    students: {
        required: true,
        v_form_name: "Daftar Nama Peserta Didik",
        v_form_key: "students",
        v_placeholder: "Daftar Peserta Didik Rujukan",
        v_type: "tableselect",
        v_data_route: "/student?"
    },
    subjects: {
        required: true,
        v_form_name: "Daftar Mata Pelajaran",
        v_form_key: "subjects",
        v_placeholder: "Daftar Mata Pelajaran Rujukan",
        v_type: "tableselect",
        v_data_route: "/subject?"
    },
};

module.exports = basicData;
