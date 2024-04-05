export const jobObjectColumns = [
    { label: 'ID', index: true, filterable: false, searchable: false, sortable: false, hidden: true, field: 'id' },
    { label: '', type: 'button', icon: 'arrow36', clickable: true, callBackPath: "jobPerformance.view"  },
    { label: 'Customer', type: 'text', filterable: true, searchable: true, sortable: false, field: 'customerName' },
    { label: 'Job Num', type: 'text', filterable: true, searchable: true, sortable: false, field: 'jobNum' },
    { label: 'Commodity', type: 'text', filterable: true, searchable: true, sortable: false, field: 'commodity' },
    { label: 'Info', type: 'array', filterable: true, searchable: true, values: [{label:'Part Name',field: 'partName'},{label:'Work Order Type',field: 'woType'},{label:'Job Status',field: 'jobStatus'}] },
    { label: 'Dates', type: 'array', filterable: true, searchable: true, values: [{label:'Kickoff',field: 'kickDate'},{label:'Commitment',field: 'commitDate'},{label:'Approved',field: 'approvalDate'}] },
    { label: 'Team', type: 'array', filterable: true, searchable: true, values: [{label:'Manager',field: 'progMan'},{label:'Lead',field: 'jobLead'},{label:'CAD',field: 'cadDesign'}] },
    { label: '', type: 'component', componentName: 'ButtonWithText', text: 'Progress Comments', clickable: true, callBackPath: "jobPerformance.addComment"  },
    { label: '', type: 'subTableHeaders', filterable: false, searchable: false, values: ['LABOUR','Hours','Actual','Diff'] },
    { label: '', type: 'subTableBody', filterable: false, searchable: false, values: ['subTable.[key].budgetHours','subTable.[key].actualHours','subTable.[key].diffHours'] },
    { label: '', type: 'subTableHeaders', filterable: false, searchable: false, values: ['PROFIT','Budget','Actual','Diff'] },
    { label: '', type: 'array', contentType: 'currency', filterable: false, searchable: false, values: [{label:'_',field: 'profit.quoteBudgetCost'},{label:'',field: 'profit.quoteActualCost'},{label:'',field: 'profit.diffCost'}] },
    // need method to construct columns based on results of jsonObject
    // consider that the JSON obj column will vary based on results of labour
]

export const jobObjectElements = [{objectType: "filter"},{objectType: "search"}];