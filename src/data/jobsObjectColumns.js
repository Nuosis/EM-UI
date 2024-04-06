export const jobObjectColumns = [
    { label: 'ID', index: true, filterable: false, searchable: false, sortable: false, hidden: true, field: 'id' },
    { label: '', type: 'button', icon: 'arrow36', clickable: true, callBackPath: "jobPerformance.view"  },
    { label: 'Customer', type: 'text', clickable: true, callBackPath: "jobPerformance.customer", filterable: true, searchable: true, sortable: false, field: 'customerName' },
    { label: 'Job Num', type: 'text', clickable: true, callBackPath: "jobPerformance.view", filterable: true, searchable: true, sortable: false, field: 'jobNum' },
    { label: 'Commodity', type: 'text', filterable: true, searchable: true, sortable: false, field: 'commodity' },
    { label: 'Info', type: 'array', filterable: true, searchable: true, values: [{label:'Part Name',field: 'partName'},{label:'Work Order Type',field: 'woType'},{label:'Job Status',field: 'jobStatus'}] },
    { label: 'Dates', type: 'array', filterable: true, searchable: true, values: [{label:'Kickoff',field: 'kickDate'},{label:'Commitment',field: 'commitDate'},{label:'Approved',field: 'approvalDate'}] },
    { label: 'Team', type: 'array', filterable: true, searchable: true, values: [{label:'Manager',field: 'progMan'},{label:'Lead',field: 'jobLead'},{label:'CAD',field: 'cadDesign'}] },
    { label: '', type: 'component', componentName: 'ButtonWithText', text: 'Progress Comments', clickable: true, callBackPath: "jobPerformance.addComment"  },
    { label: '', type: 'subTableHeaders', filterable: false, searchable: false, values: ['_','Hours','Actual','Diff'] },
    { label: '', type: 'subTableBody', clickable: true, callBackPath: "jobPerformance.chart", filterable: false, searchable: false, values: ['labour.[key].budgetHours','labour.[key].actualHours','labour.[key].diffHours'] },
    { label: '', type: 'subTableHeaders', filterable: false, searchable: false, values: ['_','Budget','Actual','Diff'] },
    { label: '', type: 'subTableBody', clickable: true, callBackPath: "jobPerformance.chart", contentType: 'currency', filterable: false, searchable: false, values: ['other.[key].budget','other.[key].actual','other.[key].diff'] },
    { label: '', type: 'subTableBody', contentType: 'currency', filterable: false, searchable: false, values: ['profit.[key].quoteBudgetCost','profit.[key].quoteActualCost','profit.[key].diffCost'] },
]

export const jobObjectElements = [{objectType: "filter"},{objectType: "search"}];