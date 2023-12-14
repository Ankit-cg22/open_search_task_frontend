import axios from 'axios'
import React, { useEffect , useState} from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { OpenSearchRequestHeaders } from '../utils';
import ChartCard from './ChartCard';
import { CircularProgress, Container, Grid } from '@mui/material';

export default function HighestRunsAndWickets() {
  const [loading , setLoading] = useState(0)
const [data , setData] = useState()
const [wicketsOptionsBar , setWicketsOptionsBar] = useState();
const [runsOptionsBar , setRunsOptionsBar] = useState();
const url = 'https://localhost:9200/player_index/_search';
const query = {
  "query": {
    "match_all": {}
  }
};

  useEffect(()=>{
    let player_data , player_data1 , total_scores , total_wickets;
    setLoading(true)
    const requests = [

      axios.post('https://localhost:9200/_plugins/_sql', 
        {
          "query" : "select * from player_index"
        } , {headers: OpenSearchRequestHeaders }),
        axios.post('https://localhost:9200/_plugins/_sql', 
        {
          "query" : "select pw.player_id , sum(pw.wickets_taken) as total_wickets from player_wickets_index pw group by pw.player_id order by total_wickets desc"
        } , {headers: OpenSearchRequestHeaders }),
        axios.post('https://localhost:9200/_plugins/_sql', 
        {
          "query" : "select * from player_index"
        } , {headers: OpenSearchRequestHeaders }),
        axios.post('https://localhost:9200/_plugins/_sql', 
        {
          "query" : "select ps.player_id , sum(ps.runs_scored) as total_runs from player_score_index ps group by ps.player_id order by total_runs desc"
        } , {headers: OpenSearchRequestHeaders })
    ]
    
    axios.all(requests)
    .then(
      axios.spread((res1 , res2 , res3 , res4)=>{
        player_data = res1.data.datarows
        total_wickets = res2.data.datarows
          for(let i = 0 ; i<total_wickets.length ; i++){
            let id = Number(total_wickets[i][0])-1
            total_wickets[i].push(player_data[id][3])
            total_wickets[i].push(player_data[id][1])
            total_wickets[i].push(player_data[id][0])
          }
          setData(total_wickets)

          const vals = []
          const names = []

          for(let i = 0  ;i<total_wickets.length ; i++){
            names.push(`${total_wickets[i][2]} ${total_wickets[i][3]}`)
            vals.push(total_wickets[i][1])
          }


          setWicketsOptionsBar(
            {
              chart: {
                type: 'bar',
              },
              title: {
                text: 'Highest Wickets',
              },
              xAxis: {
                categories: names,
              },
              yAxis: {
                title: {
                  text: 'Wickets Taken',
                },
              },
              series: [
                {
                  name: 'Wickets Taken',
                  data: vals,
                },
              ],
            })
            player_data1 = res3.data.datarows
            total_scores = res4.data.datarows
            for(let i = 0 ; i<total_scores.length ; i++){
              let id = Number(total_scores[i][0])-1
              total_scores[i].push(player_data1[id][3])
              total_scores[i].push(player_data1[id][1])
              total_scores[i].push(player_data1[id][0])
            }
            setData(total_scores)
  
            const vals1 = []
            const names1 = []
  
            for(let i = 0  ;i<total_scores.length ; i++){
              names1.push(`${total_scores[i][2]} ${total_scores[i][3]}`)
              vals1.push(total_scores[i][1])
            }
  
            setRunsOptionsBar(
              {
                chart: {
                  type: 'bar',
                },
                title: {
                  text: 'Highest Runs',
                },
                xAxis: {
                  categories: names1,
                },
                yAxis: {
                  title: {
                    text: 'Runs Scored',
                  },
                },
                series: [
                  {
                    name: 'Runs Scored',
                    data: vals1,
                  },
                ],
              })
      })
    )
    .catch(err =>{ 
      console.log(err)
    })
    .finally(()=>{
      setLoading(false)
    })
  }, [])

      if(loading){
        return <div style={{marginTop : "20px"}}><CircularProgress/></div>
      }
  return (
    <Container style={{ display: 'flex', width:"100vw" , minWidth:"800px" , maxWidth:"1500px", padding:"0" , marginTop : "20px" ,height: '87vh' , justifyContent:"space-between"  }}>
      <Grid container spacing={2} >
        <Grid item xs={24} sm={12} md={8} style={{margin:'auto' , marginTop:"20px"}}>
          <ChartCard options={runsOptionsBar}/>
        </Grid>
        <Grid item xs={24} sm={12} md={8} style={{margin:'auto' , marginTop:"20px"}}>
          <ChartCard options={wicketsOptionsBar}/>
        </Grid>
      </Grid>
    </Container>
  )
}
