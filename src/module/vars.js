export const fetchErrors = {
    verify: "Аккаунт пользователя не подтвержден!",
    forbidden: "Вы заблокированы и не можете войти!"
}
export const usersArr = [
    { name: 'Менеджер', value: 'manager' },
    { name: 'Пользователь', value: 'user' },
    { name: 'Эксперт', value: 'expert' },
    { name: 'Рабочая группа', value: 'workingGroup' },
    { name: "Эксперт спецконкурса", value: 'expertSpecComp'}
]
export const booleanArr = [
    { name: 'Да', value: true },
    { name: 'Нет', value: false },
]
export const projectFieldsArr = [
    {
        name: "Название проекта",
        value: "",
        translitName: "title",
        required: true,
        error: false,
        errorTxt: "Заполните поле",
    },
    {
        name: "Обложка",
        value: [],
        translitName: "imageURL",
        type: "image",
        required: true,
        error: false,
        errorTxt: "Выберите изображение",
        validate: {
            types: ["image/jpeg", "image/gif", "image/png"],
            format: ".jpg, .jpeg, .gif, .png",
            resolution: "1420x660",
            width: 1420,
            height: 660,
            size: 5 * 1024 * 1024
        }
    },
    {
        name: "Направление",
        value: "",
        type: "select",
        translitName: "direction",
        required: true,
        error: false,
        errorTxt: "Выберите направление"
    },
    {
        name: "Грантополучатель",
        value: "1",
        translitName: "grantee",
        type: "radio"
    },
    {
        name: "Сумма грантовых средств, запрашиваемая для реализации проекта",
        value: "",
        translitName: "sum",
        type: "number",
        required: true,
        error: false,
        errorTxt: "Укажите сумму"
    },
    {
        name: "Краткое описание проекта",
        value: "",
        translitName: "description",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Целевая аудитория проекта",
        value: "",
        translitName: "targetAudience",
        type: 'html',
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Актуальность проекта для целевых аудиторий",
        value: "",
        translitName: "relevance",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Цель проекта",
        value: "",
        translitName: "goal",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Задачи проекта",
        value: "",
        translitName: "tasks",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Наличие социокультурных эффектов. Количественные показатели",
        value: "",
        translitName: "culturalEffectsQuantity",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Наличие социокультурных эффектов. Качественные показатели",
        value: "",
        translitName: "culturalEffectsQuality",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Наличие экономического эффекта. Прямые экономические эффекты",
        value: "",
        translitName: "economicEffectsDirect",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле",
        notyTxt: "Если вы участвуете в специальной грантовой поддержке культурных проектов, посвящённых 80-летию Великой Победы, в этом поле можете поставить прочерк."
    },
    {
        name: "Наличие экономического эффекта. Косвенные экономические эффекты",
        value: "",
        translitName: "economicEffectsIndirect",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле",
        notyTxt: "Если вы участвуете в специальной грантовой поддержке культурных проектов, посвящённых 80-летию Великой Победы, в этом поле можете поставить прочерк."
    },
    {
        name: "Смета",
        value: [],
        translitName: "budget",
        type: "file",
        required: true,
        error: false,
        errorTxt: "Выберите файл",
        validate: {
            types: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
            format: ".xls, .xlsx",
            size: 5 * 1024 * 1024
        }
    },
    {
        name: "Визуальная составляющая проекта",
        value: [],
        translitName: "visualComponent",
        type: "file",
        required: true,
        error: false,
        errorTxt: "Выберите файл",
        validate: {
            types: [
                "application/pdf",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            ],
            format: ".pdf, .ppt, .pptx",
            size: 5 * 1024 * 1024
        }
    },
    {
        name: "Партнеры проекта",
        value: "",
        translitName: "partners",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Информационное обеспечение проекта",
        value: "",
        translitName: "infoProvision",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Перспективы развития проекта",
        value: "",
        translitName: "devProspects",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Сайт проекта",
        value: "",
        placeholder: "Например, https://www.hr.government-nnov.ru",
        translitName: "website",
        type: "link",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Сроки реализации проекта",
        value: "",
        translitName: "execTime",
        type: "date",
    },
    {
        name: "Рекомендатели проекта",
        label: "можно загузить несколько файлов",
        value: [],
        translitName: "recommenders",
        type: "file",
        isMultiple: true,
        required: true,
        error: false,
        errorTxt: "Выберите файл",
        validate: {
            types: [
                "application/pdf"
            ],
            format: ".pdf",
            size: 5 * 1024 * 1024
        }
    },
    {
        name: "Видеовизитка проекта (ссылка на файл в облаке. Файл должен быть доступным для просмотра по ссылке)",
        value: "",
        placeholder: "Например, https://disk.yandex.ru/i/aBcDeFg12345",
        translitName: "videoURL",
        type: "link"
    },
    {
        name: "Презентация проекта",
        value: [],
        translitName: "presentation",
        type: "file",
        required: true,
        error: false,
        errorTxt: "Выберите файл",
        validate: {
            types: [
                "application/pdf",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            ],
            format: ".pdf, .ppt, .pptx",
            size: 5 * 1024 * 1024
        }
    },
    {
        name: "Календарный план",
        value: [],
        translitName: "calendarPlan",
        type: "file",
        required: true,
        error: false,
        errorTxt: "Выберите файл",
        validate: {
            types: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
            format: ".xls, .xlsx",
            size: 5 * 1024 * 1024
        }
    },
    {
        name: "Руководитель проекта",
        value: "",
        translitName: "manager",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Возраст",
        value: "",
        translitName: "age",
        type: "number",
    },
    {
        name: "Телефон для связи",
        value: "",
        placeholder: "+7",
        translitName: "phone",
        type: 'tel',
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Email для связи",
        value: "",
        translitName: "email",
        type: 'email',
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Место учёбы",
        value: "",
        translitName: "edu",
    },
    {
        name: "Место работы",
        value: "",
        translitName: "workplace"
    },
    {
        name: "Страницы автора в соц сетях",
        value: "",
        translitName: "social",
        type: "social",
        data: [
            {
                name: "ВКонтакте",
                value: "",
                translitName: "vk",
                placeholder: "https://vk.com/yourpage"
            },
            {
                name: "Одноклассники",
                value: "",
                translitName: "odnoklassniki",
                placeholder: "https://ok.ru/yourpage"
            }
        ]
    },
    {
        name: "Опыт проектной деятельности руководителя проекта",
        value: "",
        translitName: "managementExperience",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Участники проекта",
        value: "",
        translitName: "participants",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    },
    {
        name: "Опыт проектной деятельности участников проекта",
        value: "",
        translitName: "participantExperience",
        type: "html",
        required: true,
        error: false,
        errorTxt: "Заполните поле"
    }
]
export const projectGranteeFieldsArr = [
    {
        name: "Юридическое лицо",
        value: "1",
        data: [
            {
                name: "Наименование организации",
                value: "",
                translitName: "orgName",
                required: true,
                error: false,
                errorTxt: "Заполните поле"
            },
            {
                name: "Адрес организации",
                value: "",
                translitName: "orgAddress",
                required: true,
                error: false,
                errorTxt: "Заполните поле"
            },
            {
                name: "Реквизиты организации",
                value: "",
                translitName: "orgRequisites",
                type: "html",
                required: true,
                error: false,
                errorTxt: "Заполните поле"
            },
            {
                name: "Устав организации",
                value: [],
                translitName: "orgCharter",
                type: "granteeFile",
                validate: {
                    types: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
                    format: ".pdf, .doc, .docx",
                    size: 5 * 1024 * 1024
                },
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
            {
                name: "Свидетельство о государственной регистрации юридического лица в Едином государственном реестре юридических лиц (ЕГРЮЛ)",
                value: [],
                translitName: "legalEntityRegCert",
                type: "granteeFile"
            },
            {
                name: "Свидетельство о регистрации юридического лица в налоговом органе по месту нахождения юридического лица",
                value: [],
                translitName: "legalEntityTaxRegCert",
                type: "granteeFile"
            },
            {
                name: "Выписка из Единого государственного реестра юридических лиц (ЕГРЮЛ)",
                value: [],
                translitName: "legalEntityRegExtract",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
            {
                name: "Справка о состоянии расчетов по налогам, сборам, пеням и штрафам, выданная налоговым органом",
                value: [],
                translitName: "legalEntityTaxDebtCert",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            }
        ]
    },
    {
        name: "Индивидуальный предприниматель",
        value: "2",
        data: [
            {
                name: "Реквизиты ИП (банковские реквизиты и адрес регистрации ИП)",
                value: "",
                translitName: "ipRequisites",
                type: "html",
                required: true,
                error: false,
                errorTxt: "Заполните поле"
            },
            {
                name: "Свидетельство о государственной регистрации ИП в Едином государственном реестре индивидуальных предпринимателей (ЕГРИП)",
                value: [],
                translitName: "ipRegCert",
                type: "granteeFile"
            },
            {
                name: "Свидетельство о регистрации ИП в налоговом органе по месту нахождения",
                value: [],
                translitName: "ipTaxRegCert",
                type: "granteeFile"
            },
            {
                name: "Выписка из Единого государственного реестра индивидуальных предпринимателей (ЕГРИП)",
                value: [],
                translitName: "ipRegExtract",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
            {
                name: "Справка о состоянии расчетов по налогам, сборам, пеням и штрафам, выданная налоговым органом",
                value: [],
                translitName: "ipTaxDebtCert",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            }
        ]
    },
    {
        name: "Физическое лицо",
        value: "3",
        data: [
            {
                name: "Копия всех страниц паспорта",
                value: [],
                translitName: "passport",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
            {
                name: "Копия свидетельства о постановке на учет физического лица в налоговом органе на территории Российской Федерации",
                value: [],
                translitName: "taxRegCert",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
            {
                name: "Справка об отсутствии задолженности по налогам, сборам, пеням и штрафам, выданная налоговым органом",
                value: [],
                translitName: "taxDebtCert",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
            {
                name: "Декларация (заверение) гражданина о том, что он не признан банкротом и он не находится в состоянии реструктуризации его долгов",
                value: [],
                translitName: "bankruptcyDeclaration",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
            {
                name: "Справка об отсутствии судимости и (или) факта уголовного преследования либо о прекращении уголовного преследования, выданная органом внутренних дел",
                value: [],
                translitName: "criminalRecordCert",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            }
        ]
    },
    {
        name: "Физическое лицо - самозанятый",
        value: "4",
        data: [
            {
                name: "Копия всех страниц паспорта",
                value: [],
                translitName: "passport",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
            {
                name: "Копия свидетельства о постановке на учет физического лица в налоговом органе на территории Российской Федерации",
                value: [],
                translitName: "taxRegCert",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
            {
                name: "Справка об отсутствии задолженности по налогам, сборам, пеням и штрафам, выданная налоговым органом",
                value: [],
                translitName: "taxDebtCert",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
            {
                name: "Декларация (заверение) гражданина о том, что он не признан банкротом и он не находится в состоянии реструктуризации его долгов",
                value: [],
                translitName: "bankruptcyDeclaration",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
            {
                name: "Справка об отсутствии судимости и (или) факта уголовного преследования либо о прекращении уголовного преследования, выданная органом внутренних дел",
                value: [],
                translitName: "criminalRecordCert",
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
            {
                name: 'Справка, подтверждающая статус плательщика налога на профессиональный доход',
                value: [],
                translitName: 'selfEmployedTaxCert',
                type: "granteeFile",
                required: true,
                error: false,
                errorTxt: "Выберите файл"
            },
        ]
    },
]
export const monthArr = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
