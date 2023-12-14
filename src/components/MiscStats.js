import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { OpenSearchRequestHeaders } from '../utils'
import { Box, CircularProgress, Container, Grid } from '@mui/material'
import ChartCard from './ChartCard'

export default function MiscStats() {
    const [loading , setLoading] = useState(true)
    const [aggScore , setAggScore] = useState({});
    const [stackedBoundaryData , setStackedBoundaryData] = useState({});
    const [pieFoursDataOptions ,setPieFoursDataOptions] = useState({})
    const [pieSixesDataOptions ,setPieSixesDataOptions] = useState({})
    const [scattDataOptions , setScattDataOptions] = useState({})
    function helper(data){
      const vals = []
      for(let i = 0 ; i<data.length ;i++)vals.push(data[i].aggVal.value)
      return vals;
      
    }

    function getScattArr(data){
      const arr = []
      for(let i = 0 ; i<data.length ; i++){
        arr.push([ data[i]._source.matches_played , data[i]._source.batting_average ])
      }
      return arr
    }

    const fetchData = () => {  
        const requests = [
            axios.post(`https://localhost:9200/match_brief_index/_search`,
            {
                "size": 0,
                "aggs": {
                  "total_score": {
                    "terms": {
                      "field": "match_id"
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
            },
            {headers: OpenSearchRequestHeaders }
            ),
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
                "first_inning_score": {
                  "terms": {
                    "field": "match_id"
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
            },
            {headers: OpenSearchRequestHeaders }
            ),
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
                "second_inning_score": {
                  "terms": {
                    "field": "match_id"
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
            },
            {headers: OpenSearchRequestHeaders }
            ),
            axios.post(`https://localhost:9200/boundary_brief_index/_search`,            
            {
              "size": 0,
              "aggs": {
                "teams": {
                  "terms": {
                    "field": "team"
                  },
                  "aggs": {
                    "total_fours": {
                      "sum": {
                        "field": "fourCount"
                      }
                    },
                    "total_sixes": {
                      "sum": {
                        "field": "sixCount"
                      }
                    },
                    "total_runs": {
                      "sum": {
                        "field": "totalScore"
                      }
                    },
                    "runs_in_fours": {
                      "bucket_script": {
                        "buckets_path": {
                          "total_fours": "total_fours"
                        },
                        "script": "params.total_fours * 4"
                      }
                    },
                    "runs_in_sixes": {
                      "bucket_script": {
                        "buckets_path": {
                          "total_sixes": "total_sixes"
                        },
                        "script": "params.total_sixes * 6"
                      }
                    },
                    "runs_in_boundaries": {
                      "bucket_script": {
                        "buckets_path": {
                          "fours": "runs_in_fours",
                          "sixes": "runs_in_sixes"
                        },
                        "script": "params.fours + params.sixes"
                      }
                    },
                    "runs_in_others": {
                      "bucket_script": {
                        "buckets_path": {
                          "total_runs": "total_runs",
                          "runs_in_boundaries": "runs_in_boundaries"
                        },
                        "script": "params.total_runs - params.runs_in_boundaries"
                      }
                    }
                  }
                }
              }
            },
            {headers: OpenSearchRequestHeaders }
            ),
            
            axios.post(`https://localhost:9200/batting_average_index/_search`,            
            {
              "_source": ["matches_played", "batting_average"],
              "query": {
                "match": {
                  "team": "India"
                }
              }
            },
            {headers: OpenSearchRequestHeaders }
            ),
            axios.post(`https://localhost:9200/batting_average_index/_search`,            
            {
              "_source": ["matches_played", "batting_average"],
              "query": {
                "match": {
                  "team": "Australia"
                }
              }
            },
            {headers: OpenSearchRequestHeaders }
            ),
            axios.post(`https://localhost:9200/batting_average_index/_search`,            
            {
              "_source": ["matches_played", "batting_average"],
              "query": {
                "match": {
                  "team": "New Zealand"
                }
              }
            },
            {headers: OpenSearchRequestHeaders }
            ),
            axios.post(`https://localhost:9200/batting_average_index/_search`,            
            {
              "_source": ["matches_played", "batting_average"],
              "query": {
                "match": {
                  "team": "South Africa"
                }
              }
            },
            {headers: OpenSearchRequestHeaders }
            ),


        ]
        setLoading(true)

        axios.all(requests)
        .then(
            axios.spread(
                (res1 , res2 , res3 , res4 , res5 , res6 , res7 , res8)=>{
                    const data1 = helper(res1.data.aggregations.total_score.buckets)
                    const data2 = helper(res2.data.aggregations.first_inning_score.buckets)
                    const data3 = helper(res3.data.aggregations.second_inning_score.buckets)

                    const data4 = res4.data.aggregations.teams.buckets

                    const series = []
                    series.push( { name: "Total Aggregate Score" , data : data1})
                    series.push( { name: "First Innings Score" , data : data2})
                    series.push( { name: "Second Innings Score" , data : data3})
                    
                    const vals = []
                    for(let i = 0 ; i<data1.length ; i++) vals.push(`Match ${i+1}`)


                    setAggScore({chart: {
                      type: 'line',
                    },
                    title: {
                      text: 'Cricket Match Scores',
                    },
                    xAxis: {
                      categories: vals,
                    },
                    yAxis: {
                      title: {
                        text: 'Runs Scored',
                      },
                    },
                    series: series,
                  })
                  const fourData = [] , sixData = [] , fourRunsData = [] , sixRunsData = [] , otherRunsData= [] , teamNames = []
                  for(let i = 0 ; i<data4.length ; i++){
                    teamNames.push(data4[i].key)
                    fourRunsData.push(data4[i].runs_in_fours.value)
                    sixRunsData.push(data4[i].runs_in_sixes.value)
                    otherRunsData.push(data4[i].runs_in_others.value)
                    fourData.push(data4[i].total_fours.value)
                    sixData.push(data4[i].total_sixes.value)
                  }
                  setStackedBoundaryData(
                    {
                      chart: {
                        type: 'column',
                      },
                      title: {
                        text: 'Runs Distribution by Type',
                      },
                      xAxis: {
                        categories: teamNames,
                      },
                      yAxis: {
                        title: {
                          text: 'Runs',
                        },
                      },
                      legend: {
                        reversed: true,
                      },
                      plotOptions: {
                        column: {
                          stacking: 'normal',
                        },
                      },
                      series: [
                        {
                          name: 'Runs in Sixes',
                          data: sixRunsData,
                        },
                        {
                          name: 'Runs in Fours',
                          data: fourRunsData,
                        },
                        {
                          name: 'Runs in Others',
                          data: otherRunsData,
                        },
                      ],
                    }
                  )
                    
                const sixesPieData = [] , foursPieData = []
                for(let i = 0 ; i<teamNames.length ; i++){
                  sixesPieData.push({
                    name : teamNames[i] , 
                    y : sixData[i]
                  })
                  foursPieData.push({
                    name : teamNames[i] , 
                    y : fourData[i]
                  })
                }
                setPieFoursDataOptions({
                    chart: {
                      type: 'pie',
                    },
                    title: {
                      text: 'Fours',
                    },
                    series: [
                      {
                        name: 'Fours',
                        data: foursPieData,
                      },
                    ],
                })
                setPieSixesDataOptions({
                  chart: {
                    type: 'pie',
                  },
                  title: {
                    text: 'Sixes',
                  },
                  series: [
                    {
                      name: 'Sixes',
                      data: sixesPieData,
                    },
                  ],
              })

              const scattSeries = []
              scattSeries.push({
                name:"India" , 
                data : getScattArr(res5.data.hits.hits)
              })
              scattSeries.push({
                name:"Australia" , 
                data : getScattArr(res6.data.hits.hits)
              })
              scattSeries.push({
                name:"New Zealand" , 
                data : getScattArr(res7.data.hits.hits)
              })
              scattSeries.push({
                name : "South Africa" ,
                data : getScattArr(res8.data.hits.hits)
              })

              setScattDataOptions(
                {
                  chart: {
                    type: 'scatter',
                    zoomType: 'xy',
                  },
                  title: {
                    text: 'Batting Averages',
                  },
                  xAxis: {
                    title: {
                      enabled: true,
                      text: 'Matches Played',
                    },
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true,
                  },
                  yAxis: {
                    title: {
                      text: 'Batting Average',
                    },
                  },
                  series: scattSeries,
                }
              )
              
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
    } , [])
    if(loading){
      return <div style={{marginTop : "20px"}}><CircularProgress/></div>
    }
  
  return (
    <Container style={{ display: 'flex', width:"100vw" , minWidth:"800px" , maxWidth:"1500px", padding:"0" , marginTop : "20px" ,height: '87vh' , justifyContent:"space-between"  }}>
        <Box style={{ flex: '1' , overflow:"scroll" }}>
            {aggScore.chart && 
             <Grid container spacing={2}>
             <Grid item xs={12} sm={6} md={4}>
               <ChartCard options={aggScore} />
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
              <ChartCard options={stackedBoundaryData} />
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
             <ChartCard options={pieFoursDataOptions} />
             </Grid>
             <Grid item xs={12} sm={6} md={4}>
              <ChartCard options={pieSixesDataOptions} />
             </Grid>
             <Grid item xs={24} sm={12} md={8}>
              <ChartCard options={scattDataOptions} />
             </Grid>
             
            </Grid>
            } 
        </Box>
      </Container>
  )
}
