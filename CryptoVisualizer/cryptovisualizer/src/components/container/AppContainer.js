import "./AppContainer.css"
import HeaderComponent from "./header/HeaderComponent";
import ContentComponent from "./content/ContentComponent";


const AppContainer = () => {
    return (
        <div className='container'>
            <div className="header">
                <HeaderComponent />
            </div>
            <div className="content">
                <ContentComponent />
            </div>
        </div>
    );
}

export default AppContainer;