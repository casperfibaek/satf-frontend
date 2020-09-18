const { React, FluentUIReact } = window;

export default function ErrorBox(props) {
   return (
      <div>
         <p>{props.errorMsg}</p>
      </div>
   )
}