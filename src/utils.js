export const dropDownLinks = [
    {title : "Highest Runs" , link: "/highestRuns"} ,
    {title : "Highest Wickets" , link : "/highestWickets"},
    {title : "Team Wise Stats" , link : "/teamWiseStats"},
]

export const teamList = [
    "India" , "Australia" , "New Zealand" , "South Africa"
]

export const OpenSearchRequestHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Basic ${btoa('admin:admin')}`
  };