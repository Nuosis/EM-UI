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
    { label: '', type: 'subTableBody', clickable: true, callBackPath: "jobPerformance.chart", filterable: false, searchable: false, values: [{ field: 'labour.[key].budgetHours'},{ field: 'labour.[key].actualHours'},{ field: 'labour.[key].diffHours'}] },
    { label: '', type: 'subTableHeaders', filterable: false, searchable: false, values: ['_','Budget','Actual','Diff'] },
    { label: '', type: 'subTableBody', clickable: true, callBackPath: "jobPerformance.chart", filterable: false, searchable: false, values: [{ field: 'other.[key].budget', contentType: 'currency'},{ field: 'other.[key].actual', contentType: 'currency' },{ field: 'other.[key].diff', contentType: 'currency' }] },
    { label: '', type: 'subTableHeaders', filterable: false, searchable: false, values: ['_','Price','$','%'] },
    { label: '', type: 'subTableBody', filterable: false, searchable: false, values: [{ field: 'profit.[key].totalPrice', contentType: 'currency' },{ field: 'profit.[key].diffCostBurden', contentType: 'currency' },{ field: 'profit.[key].percentProfitBurden', contentType: 'percent' }, ] },
]

export const jobObjectElements = [{objectType: "filter"},{objectType: "search"}];