import axios from 'axios'
import React, { useEffect , useState} from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { OpenSearchRequestHeaders } from '../utils';

export default function HighestWickets() {
const [data , setData] = useState()
const [optionsBar , setOptionsBar] = useState();
const url = 'https://localhost:9200/player_index/_search';
const query = {
  "query": {
    "match_all": {}
  }
};



    useEffect(()=>{
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

          setOptionsBar(
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
