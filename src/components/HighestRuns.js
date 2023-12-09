import axios from 'axios'
import React, { useEffect , useState} from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function HighestRuns() {
const [data , setData] = useState()
const [optionsBar , setOptionsBar] = useState();
const url = 'https://localhost:9200/player_index/_search';
const query = {
  "query": {
    "match_all": {}
  }
};

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Basic ${btoa('admin:admin')}`
};

    useEffect(()=>{
        let player_data  , total_scores;
        axios.post('https://localhost:9200/_plugins/_sql', 
        {
          "query" : "select * from player_index"
        } , {headers: headers })
        .then(res=>{
          player_data = res.data.datarows
        })
        .catch(err=>{
          console.log(err)
        })

        axios.post('https://localhost:9200/_plugins/_sql', 
        {
          "query" : "select ps.player_id , sum(ps.runs_scored) as total_runs from player_score_index ps group by ps.player_id order by total_runs desc"
        } , {headers: headers })
        .then(res=>{
          total_scores = res.data.datarows
          for(let i = 0 ; i<total_scores.length ; i++){
            let id = Number(total_scores[i][0])-1
            total_scores[i].push(player_data[id][3])
            total_scores[i].push(player_data[id][1])
            total_scores[i].push(player_data[id][0])
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

          setOptionsBar(
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
                  text: 'Values',
                },
              },
              series: [
                {
                  name: 'Values',
                  data: vals,
                },
              ],
            })
        })
        .catch(err=>{
          console.log(err)
        })
      } , [])
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={optionsBar} />
    </div>
  )
}
