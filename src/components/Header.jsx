
import React from 'react';
export default function Header(){


return(

    <header className = 'flex items-center justify-between gap-4 p-4'>
        <a href = "/"><h1 className = 'font-medium'>Speech<span className = 'text-blue-400 bold'>Scribe</span></h1> </a>
        {/* keep space between elements equal = between */}
        <a href = "/"><button className = 'flex items-center gap-2 spcialbutton px-4 py-2 rounded-lg text-blue-400'>
          <p>New</p>
          {/* using icon from font awesome */}
          <i className ="fa-solid fa-plus"></i>
        </button></a>
        
      </header>
);



}