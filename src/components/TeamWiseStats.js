import { Box, Button, Card, CardContent, CircularProgress, Container, Grid, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { OpenSearchRequestHeaders, getIndex, teamList } from '../utils'
import axios from 'axios'
import ChartCard from './ChartCard';


export default function TeamWiseStats() {
    const [loading , setLoading] = useState(true)
    const [totalRuns , setTotalRuns] = useState({});
    const [totalRunsBatFirst , setTotalRunsBatFirst] = useState({});
    const [totalRunsBatSecond , setTotalRunsBatSecond] = useState({});
    const [totalRunsBForAO , setTotalRunsBForAO] = useState({});
    const [totalWickets , setTotalWickets] = useState({});
    const [totalWicketsRunFilter , setTotalWicketsRunFilter] = useState({});
    
    function barObject(title, valArr , minVal , maxVal){
        console.log(valArr)
        return {
            chart: {
              type: 'bar',
              height: 300,
            },
            title: {
              text: title,
            },
            xAxis: {
              categories: ["India" , "Australia" , "New Zealand" , "South Africa"],
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

    function helper(valArr , setter , title , minVal , maxVal){
      const val = [0 , 0 ,0 , 0]
      for(let i = 0 ; i<valArr.length ; i++) {
        let idx = getIndex(valArr[i].key)
        if(idx!=null)val[ idx ] = valArr[i].aggVal.value
      }
      setter( barObject( title  , val  , minVal , maxVal) )
    }
    
    const fetchData = () => {  
          
          console.log("searching ....")
        const requests = [
            axios.post(`https://localhost:9200/match_brief_index/_search`,
            {
              "aggs": {
                "total_runs": {
                  "terms": {
                    "field": "team",
                    "size": 10
                  },
                  "aggs": {
                    "aggVal": {
                      "sum": {
                        "field": "runs_scored"
                      }
                    }
                  }
                }
              }
            }, {headers: OpenSearchRequestHeaders }) ,
            axios.post(`https://localhost:9200/match_brief_index/_search`,
            {
              "size": 0,
              "query": {
                "bool": {
                  "filter": [
                    {"term": {"batted_first": true}}
                  ]
                }
              },
              "aggs": {
                "total_runs": {
                  "terms": {
                    "field": "team",
                    "size": 10
                  },
                  "aggs": {
                    "aggVal": {
                      "sum": {
                        "field": "runs_scored"
                      }
                    }
                  }
                }
              }
            }, {headers: OpenSearchRequestHeaders }),
              axios.post(`https://localhost:9200/match_brief_index/_search`,
              {
                "size": 0,
                "query": {
                  "bool": {
                    "filter": [
                      {"term": {"batted_first": false}}
                    ]
                  }
                },
                "aggs": {
                  "total_runs": {
                    "terms": {
                      "field": "team",
                      "size": 10
                    },
                    "aggs": {
                      "aggVal": {
                        "sum": {
                          "field": "runs_scored"
                        }
                      }
                    }
                  }
                }
              }, {headers: OpenSearchRequestHeaders }),
              axios.post(`https://localhost:9200/match_brief_index/_search`,
              {
                "size": 0,
                "query": {
                  "bool": {
                    "should": [
                      {"bool": {"must": {"term": {"batted_first": true}}}},
                      {"bool": {"must": {"term": {"wickets_taken": 10}}}}
                    ]
                  }
                },
                "aggs": {
                  "total_runs": {
                    "terms": {
                      "field": "team",
                      "size": 10
                    },
                    "aggs": {
                      "aggVal": {
                        "sum": {
                          "field": "runs_scored"
                        }
                      }
                    }
                  }
                }
              }, {headers: OpenSearchRequestHeaders }),
              axios.post(`https://localhost:9200/match_brief_index/_search`,
              {
                "size": 0,
                "aggs": {
                  "total_wickets": {
                    "terms": {
                      "field": "team",
                      "size": 10
                    },
                    "aggs": {
                      "aggVal": {
                        "sum": {
                          "field": "wickets_taken"
                        }
                      }
                    }
                  }
                }
              }, {headers: OpenSearchRequestHeaders }),
              axios.post(`https://localhost:9200/match_brief_index/_search`,
              {
                "size": 0,
                "query": {
                  "bool": {
                    "filter": [
                      {"range": {"runs_scored": {"gt": 250}}}
                    ]
                  }
                },
                "aggs": {
                  "total_wickets": {
                    "terms": {
                      "field": "team",
                      "size": 10
                    },
                    "aggs": {
                      "aggVal": {
                        "sum": {
                          "field": "wickets_taken"
                        }
                      }
                    }
                  }
                }
              }
            , {headers: OpenSearchRequestHeaders })

        ]
        
        setLoading(true)
        axios.all(requests)
        .then(
            axios.spread(
                (res1 , res2 , res3 , res4 , res5 , res6)=>{
                    const data1 = res1.data.aggregations.total_runs.buckets
                    const data2 = res2.data.aggregations.total_runs.buckets
                    const data3 = res3.data.aggregations.total_runs.buckets
                    const data4 = res4.data.aggregations.total_runs.buckets
                    const data5 = res5.data.aggregations.total_wickets.buckets
                    const data6 = res6.data.aggregations.total_wickets.buckets

                    helper( data1 , setTotalRuns , "Total Runs Scored By Team "  , 0 , 1500 )
                    helper( data2 ,setTotalRunsBatFirst, "Total Runs Scored Batting First "  , 0 , 1500 )
                    helper( data3 ,setTotalRunsBatSecond, "Total Runs Scored Batting Second " , 0 , 1500  )
                    helper( data4 , setTotalRunsBForAO, "Total runs scored by team while batting first or when they bowled out the opponent" , 0 , 1500 ) 
                    helper( data5 , setTotalWickets,"Total Wickets Taken by team " , 0 , 50) 
                    helper( data6 ,setTotalWicketsRunFilter, "Total wickets taken by team when they scored more than 250 runs"  , 0 ,50) 
                    
                }
            )
        )
        .catch(err=>{
          console.log(err)
        })
        .finally(()=>{
          setLoading(false)
        })
    }
    useEffect(()=>{
      fetchData();
    }, [])
  
  if(loading){
    return <div style={{marginTop : "20px"}}><CircularProgress/></div>
  }

  return (
    <Container style={{ display: 'flex', width:"100vw" , minWidth:"800px" , maxWidth:"100vw", padding:"0" , marginTop : "20px" ,height: '87vh' , justifyContent:"space-between"  }}>
        <Box style={{ flex: '1' , overflow:"scroll" }}>
            {totalRuns.chart && 
             <Grid container spacing={2}>
             <Grid item xs={12} sm={6} md={4}>
               <ChartCard options={totalRuns} />
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
               <ChartCard options={totalRunsBatFirst} />
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
               <ChartCard options={totalRunsBatSecond} />
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
               <ChartCard options={totalRunsBForAO} />
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
               <ChartCard options={totalWickets} />
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
               <ChartCard options={totalWicketsRunFilter} />
             </Grid>
           </Grid>
            } 
        </Box>
      </Container>
  )
}
