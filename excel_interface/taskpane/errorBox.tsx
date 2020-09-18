const { React, FluentUIReact } = window;

export default function errorBox(props) {
   return (
      <div>
         <p>{props.msg}</p>
      </div>
   )
}