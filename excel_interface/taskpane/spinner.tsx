const { React, FluentUIReact } = window;

export default function Spinner(props) {
   const loading = props.loading
   return (
      <div>
         {loading && <div className="loader">Loading...</div>}
      </div>
   )
}