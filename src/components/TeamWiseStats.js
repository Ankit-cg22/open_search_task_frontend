import { Box, Button, Container, Grid, Paper } from '@mui/material'
import React, { useState } from 'react'
import { OpenSearchRequestHeaders, teamList } from '../utils'
import axios from 'axios'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function TeamWiseStats() {
    
    const [totalRuns , setTotalRuns] = useState({});
    const [totalRunsBatFirst , setTotalRunsBatFirst] = useState({});
    const [totalRunsBatSecond , setTotalRunsBatSecond] = useState({});
    const [totalRunsBForAO , setTotalRunsBForAO] = useState({});
    const [totalWickets , setTotalWickets] = useState({});
    const [totalWicketsRunFilter , setTotalWicketsRunFilter] = useState({});
    
    function barObject(title,catArr , valArr , minVal , maxVal){
        console.log(valArr)
        return {
            chart: {
              type: 'bar',
              height: 150,
            },
            title: {
              text: title,
            },
            xAxis: {
              categories: catArr,
            },
            yAxis: {
              title: {
                text: null,
              },
              min : minVal ,
              max : maxVal 
            },
            series: [
              {
                name: null,
                data: valArr,
                pointWidth: 5,
                showInLegend : false
              },
            ],
          }
    }
    
    const handleStatsButtonClick = (teamName) => {  
          
          console.log("searching ....")
        const requests = [
            axios.post(`https://localhost:9200/match_brief_index/_search`,
            {
                "query": {
                "match": {
                    "team": `${teamName}`
                }
                },
                "aggs": {
                "total_runs": {
                    "sum": {
                    "field": "runs_scored"
                    }
                }
                }
            }, {headers: OpenSearchRequestHeaders }) ,
            axios.post(`https://localhost:9200/match_brief_index/_search`,
            {
                "query": {
                  "bool" : {
                    "must":[
                      {
                        "match":{
                          "team" : `${teamName}`
                        }
                      },
                        {
                        "match":{
                          "batted_first" : true
                        }
                      }
                    ]
                  }
                },
                "aggs": {
                  "total_runs": {
                    "sum": {
                      "field": "runs_scored"
                    }
                  }
                }
              }, {headers: OpenSearchRequestHeaders }),
              axios.post(`https://localhost:9200/match_brief_index/_search`,
              {
                "query": {
                  "bool" : {
                    "must":[
                      {
                        "match":{
                          "team" : `${teamName}`
                        }
                      },
                        {
                        "match":{
                          "batted_first" : false
                        }
                      }
                    ]
                  }
                },
                "aggs": {
                  "total_runs": {
                    "sum": {
                      "field": "runs_scored"
                    }
                  }
                }
              }, {headers: OpenSearchRequestHeaders }),
              axios.post(`https://localhost:9200/match_brief_index/_search`,
              {
                "query": {
                  "match":{
                    "team" : `${teamName}`
                  }
                },
                "aggs":{
                  "total_wickets" : {
                    "sum" : {
                      "field" : "wickets_taken"
                    }
                  }
                }
              }, {headers: OpenSearchRequestHeaders }),
              axios.post(`https://localhost:9200/match_brief_index/_search`,
              {
                "query": {
                  "bool": {
                    "must": [
                      { "range": { "runs_scored": { "gte": 250 }}},
                      { "match": { "team": `${teamName}` }}
                    ]
                  }
                },
                "aggs": {
                  "total_wickets": {
                    "sum": {
                      "field": "wickets_taken"
                    }
                  }
                }
              }, {headers: OpenSearchRequestHeaders }),
              axios.post(`https://localhost:9200/match_brief_index/_search`,
                {
                "query": {
                    "bool": {
                    "should": [
                        {
                        "bool": {
                            "must": [
                            { "match": { "team": `${teamName}` }},
                            { "match": { "batted_first": true }}
                            ]
                        }
                        },
                        {
                        "bool": {
                            "must": [
                            { "match": { "team": `${teamName}` }},
                            { "term": { "wickets_taken": 10 }}
                            ]
                        }
                        }
                    ]
                    }
                },
                "aggs": {
                    "total_runs": {
                    "sum": {
                        "field": "runs_scored"
                    }
                    }
                }
                }
            , {headers: OpenSearchRequestHeaders }),

        ]
        
        axios.all(requests)
        .then(
            axios.spread(
                (res1 , res2 , res3 , res4 ,res5 ,res6)=>{
                    setTotalRuns( barObject( "Total Runs Scored By Team " , [ teamName ] , [res1.data.aggregations.total_runs.value]  , 0 , 2000) )
                    setTotalRunsBatFirst( barObject( "Total Runs Scored Batting First " , [ teamName ] , [res2.data.aggregations.total_runs.value] , 0 , 2000 ) )
                    setTotalRunsBatSecond( barObject( "Total Runs Scored Batting Second " , [ teamName ] , [res3.data.aggregations.total_runs.value] , 0 , 2000 ) )
                    setTotalRunsBForAO( barObject( "Total runs scored by team while batting first or when they bowled out the opponent" , [ teamName ] , [res6.data.aggregations.total_runs.value], 0 , 2000 ) )
                    setTotalWickets( barObject( "Total Wickets Taken by team " , [ teamName ] , [res4.data.aggregations.total_wickets.value] , 0 , 100) )
                    setTotalWicketsRunFilter( barObject( "Total wickets taken by team when they scored more than 250 runs" , [ teamName ] , [res5.data.aggregations.total_wickets.value] , 0 ,100) )
                    
                }
            )
        )
        .catch(err=>{
        console.log(err)
        })
    }

  return (
    <Container style={{ display: 'flex', width:"98.5vw" , minWidth:"800px" , maxWidth:"100vw", padding:"0" ,height: '87vh' , justifyContent:"space-between"  }}>
        <Paper>
        <Box style={{ flex: '1', overflow: 'hidden' ,  maxWidth:"375 px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box p={2}>
                {teamList.map((teamName , id)=>{
                    return (
                        <div style={{ minWidth:"205px" ,  margin:"15px" , display : 'flex' , justifyContent:"space-between" , alignItems:"center"}}>
                            <div> {teamName} </div>
                            <Button variant="contained" onClick={() => handleStatsButtonClick(teamName)}>Stats</Button>
                        </div>
                    )
                })

                }
              </Box>
            </Grid>
          </Grid>
        </Box>
        </Paper>
        <Box style={{ flex: '1' , overflow:"scroll" }}>
            {totalRuns.chart && 
            <>
            <div style={{marginBottom : "50px" , marginTop:"15px"}}>
                <HighchartsReact highcharts={Highcharts} options={totalRuns} />
            </div>
            <div style={{marginBottom : "50px"}}>
                <HighchartsReact highcharts={Highcharts} options={totalRunsBatFirst} />
            </div>

            <div style={{marginBottom : "50px"}}>
                <HighchartsReact highcharts={Highcharts} options={totalRunsBatSecond} />
            </div>
            <div style={{marginBottom : "50px"}}>
                <HighchartsReact highcharts={Highcharts} options={totalRunsBForAO} />
            </div>
            <div style={{marginBottom : "50px"}}>
                <HighchartsReact highcharts={Highcharts} options={totalWickets} />
            </div>
            <div style={{marginBottom : "50px"}}>
                <HighchartsReact highcharts={Highcharts} options={totalWicketsRunFilter} />
            </div>
            </>
            }
        </Box>
      </Container>
  )
}
