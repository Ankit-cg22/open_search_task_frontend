import axios from 'axios'
import React, { useEffect , useState} from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { OpenSearchRequestHeaders } from '../utils';
import ChartCard from './ChartCard';
import { CircularProgress, Grid } from '@mui/material';

export default function HighestRunsAndWickets() {
  const [loading , setLoading] = useState(true)
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
    setLoading(true)
    setRunsData();
    setWicketsData();
  }, [])

    function setWicketsData(){
        let player_data  , total_wickets;
        axios.post('https://localhost:9200/_plugins/_sql', 
        {
          "query" : "select * from player_index"
        } , {headers: OpenSearchRequestHeaders })
        .then(res=>{
          player_data = res.data.datarows
        })
        .catch(err=>{
          console.log(err)
        })

        axios.post('https://localhost:9200/_plugins/_sql', 
        {
          "query" : "select pw.player_id , sum(pw.wickets_taken) as total_wickets from player_wickets_index pw group by pw.player_id order by total_wickets desc"
        } , {headers: OpenSearchRequestHeaders })
        .then(res=>{
          total_wickets = res.data.datarows
          for(let i = 0 ; i<total_wickets.length ; i++){
            let id = Number(total_wickets[i][0])-1
            total_wickets[i].push(player_data[id][3])
            total_wickets[i].push(player_data[id][1])
            total_wickets[i].push(player_data[id][0])
          }
          console.log(total_wickets)
          setData(total_wickets)

          const vals = []
          const names = []

          for(let i = 0  ;i<total_wickets.length ; i++){
            names.push(`${total_wickets[i][2]} ${total_wickets[i][3]}`)
            vals.push(total_wickets[i][1])
          }

          console.log(vals)
          console.log(names)

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
        })
        .catch(err=>{
          console.log(err)
        })
        .finally(()=>{
          setLoading(false)
        })
      } 

      function setRunsData(){
        
          let player_data1  , total_scores;
          axios.post('https://localhost:9200/_plugins/_sql', 
          {
            "query" : "select * from player_index"
          } , {headers: OpenSearchRequestHeaders })
          .then(res=>{
            player_data1 = res.data.datarows
          })
          .catch(err=>{
            console.log(err)
          })
          axios.post('https://localhost:9200/_plugins/_sql', 
          {
            "query" : "select ps.player_id , sum(ps.runs_scored) as total_runs from player_score_index ps group by ps.player_id order by total_runs desc"
          } , {headers: OpenSearchRequestHeaders })
          .then(res=>{
            total_scores = res.data.datarows
            for(let i = 0 ; i<total_scores.length ; i++){
              let id = Number(total_scores[i][0])-1
              total_scores[i].push(player_data1[id][3])
              total_scores[i].push(player_data1[id][1])
              total_scores[i].push(player_data1[id][0])
            }
            console.log(total_scores)
            setData(total_scores)
  
            const vals = []
            const names = []
  
            for(let i = 0  ;i<total_scores.length ; i++){
              names.push(`${total_scores[i][2]} ${total_scores[i][3]}`)
              vals.push(total_scores[i][1])
            }
  
            console.log(vals)
            console.log(names)
  
            setRunsOptionsBar(
              {
                chart: {
                  type: 'bar',
                },
                title: {
                  text: 'Highest Runs',
                },
                xAxis: {
                  categories: names,
                },
                yAxis: {
                  title: {
                    text: 'Runs Scored',
                  },
                },
                series: [
                  {
                    name: 'Runs Scored',
                    data: vals,
                  },
                ],
              })
          })
          .catch(err=>{
            console.log(err)
          })
          .finally(()=>{
            setLoading(false)
          })
        
      }

      if(loading){
        return <div style={{marginTop : "20px"}}><CircularProgress/></div>
      }
  return (
    <div >
      <Grid container spacing={2} >
        <Grid item xs={24} sm={12} md={8} style={{margin:'auto' , marginTop:"20px"}}>
          <ChartCard options={runsOptionsBar}/>
        </Grid>
        <Grid item xs={24} sm={12} md={8} style={{margin:'auto' , marginTop:"20px"}}>
          <ChartCard options={wicketsOptionsBar}/>
        </Grid>
      </Grid>
    </div>
  )
}
