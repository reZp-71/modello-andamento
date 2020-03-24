//--- IMPORTA DIPENDENZE ESTERNE
// import _ from 'lodash';

//--- IMPORTA DIPENDENZE INTERNE
// import * as Modulo from './modulo.js';

//--- IMPORTA STILE
import * as d3 from "d3";

import andamentoTempo from "./andamento-tempo";
import "./style.scss";
import { set } from "d3";

//-- INSERISCI QUI IL TUO CODICE

let data0 = [
  {
    name: "USA",
    values: [
      { giorno: "2000-01-05", valore: "100" },
      { giorno: "2001-01-05", valore: "110" },
      { giorno: "2002-01-05", valore: "145" },
      { giorno: "2003-01-05", valore: "241" },
      { giorno: "2004-01-05", valore: "101" },
      { giorno: "2005-01-05", valore: "90" },
      { giorno: "2006-01-05", valore: "10" },
      { giorno: "2007-01-05", valore: "35" },
      { giorno: "2008-01-05", valore: "21" },
      { giorno: "2009-01-05", valore: "201" }
    ]
  },
  {
    name: "Canada",
    values: [
      { giorno: "2003-01-05", valore: "21" },
      { giorno: "2004-01-05", valore: "51" },
      { giorno: "2005-01-05", valore: "190" },
      { giorno: "2006-01-05", valore: "120" },
      { giorno: "2007-01-05", valore: "85" },
      { giorno: "2008-01-05", valore: "221" },
      { giorno: "2009-01-05", valore: "101" }
    ]
  },
  {
    name: "Maxico",
    values: [
      { giorno: "2000-01-05", valore: "50" },
      { giorno: "2001-01-05", valore: "10" },
      { giorno: "2002-01-05", valore: "5" },
      { giorno: "2003-01-05", valore: "71" },
      { giorno: "2004-01-05", valore: "20" },
      { giorno: "2005-01-05", valore: "9" },
      { giorno: "2006-01-05", valore: "220" },
      { giorno: "2007-01-05", valore: "235" },
      { giorno: "2008-01-05", valore: "61" },
      { giorno: "2009-01-05", valore: "10" }
    ]
  }
];

let data1 = [
  {
    name: "USA",
    values: [
      { giorno: "2000-01-05", valore: "100" },
      { giorno: "2001-01-05", valore: "110" },
      { giorno: "2002-01-05", valore: "145" },
      { giorno: "2003-01-05", valore: "241" },
      { giorno: "2004-01-05", valore: "101" },
      { giorno: "2005-01-05", valore: "90" },
      { giorno: "2006-01-05", valore: "10" },
      { giorno: "2007-01-05", valore: "35" },
      { giorno: "2008-01-05", valore: "21" },
      { giorno: "2009-01-05", valore: "201" }
    ]
  },
  {
    name: "Canada",
    values: [
      { giorno: "2003-01-05", valore: "21" },
      { giorno: "2004-01-05", valore: "51" },
      { giorno: "2005-01-05", valore: "190" },
      { giorno: "2006-01-05", valore: "120" },
      { giorno: "2007-01-05", valore: "85" },
      { giorno: "2008-01-05", valore: "221" },
      { giorno: "2009-01-05", valore: "101" }
    ]
  },
  {
    name: "Maxico",
    values: [
      { giorno: "2000-01-05", valore: "50" },
      { giorno: "2001-01-05", valore: "10" },
      { giorno: "2002-01-05", valore: "5" },
      { giorno: "2003-01-05", valore: "71" },
      { giorno: "2004-01-05", valore: "20" },
      { giorno: "2005-01-05", valore: "9" },
      { giorno: "2006-01-05", valore: "220" },
      { giorno: "2007-01-05", valore: "235" },
      { giorno: "2008-01-05", valore: "61" },
      { giorno: "2009-01-05", valore: "10" }
    ]
  },
  {
    name: "Italia",
    values: [
      { giorno: "2000-01-05", valore: "1" },
      { giorno: "2001-01-05", valore: "3" },
      { giorno: "2002-01-05", valore: "5" },
      { giorno: "2003-01-05", valore: "9" },
      { giorno: "2004-01-05", valore: "20" },
      { giorno: "2005-01-05", valore: "60" },
      { giorno: "2006-01-05", valore: "55" },
      { giorno: "2007-01-05", valore: "150" },
      { giorno: "2008-01-05", valore: "179" },
      { giorno: "2009-01-05", valore: "80" }
    ]
  }
];

var arr = ["a", "b", "c"];
arr = arr.reduce((a, b) => ((["cazzo"][b] = b), a), {});
console.log(arr);

let andamento = new andamentoTempo("#andamento", { width: 1000, height: 500 });

let fase = false;

document.getElementById('cambia').addEventListener('click',()=>{ cambia() });

let cambia = () => {
    let clonato;
    if (!fase) {
        console.log("data",data0);
        clonato = JSON.parse(JSON.stringify(data0));
      } else {
        console.log("data1",data1);
        clonato = JSON.parse(JSON.stringify(data1));
      }
      clonato[0].name ='CAZZO';
      console.log('clonato',clonato);
      andamento.render(clonato);
    fase = !fase;
}

cambia();
