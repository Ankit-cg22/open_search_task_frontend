export const dropDownLinks = [
    {title : "Highest Runs and Wickets" , link : "/highestsRunsAndWickets"},
    {title : "Team Wise Stats" , link : "/teamWiseStats"},
    {title : "Miscellaneous Stats" , link : "/miscStats"},
]

export const teamList = [
    "India" , "Australia" , "New Zealand" , "South Africa"
]

export function getIndex(teamName) {
    for(let i = 0 ; i<4 ; i++){
        if(teamList[i] == teamName)return i;
    }
    return null;
}

export const OpenSearchRequestHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Basic ${btoa('admin:admin')}`
  };