import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import './generate-project.css'
import {selectStatus} from "../store/compage-slice";
import {generateProject} from "../service/compage-service";

const GenerateProject = () => {
    const dispatch = useAppDispatch();
    const generatedProject = useAppSelector(state => state.compage.generatedProject);
    const status = useAppSelector(selectStatus);
    const object = {
        userName: "mahendraintelops",
        repoName: "samplerepo1",
        projectName: "device-backend",
        yaml: "{\n    \"edges\": {\n      \"edge-62\": {\n        \"dest\": \"node-dc\",\n        \"id\": \"edge-62\",\n        \"src\": \"node-1d\"\n      },\n      \"edge-40\": {\n        \"dest\": \"node-ee\",\n        \"id\": \"edge-40\",\n        \"src\": \"node-dc\"\n      },\n      \"edge-84\": {\n        \"dest\": \"node-ee\",\n        \"id\": \"edge-84\",\n        \"src\": \"node-a6\"\n      },\n      \"edge-74\": {\n        \"dest\": \"node-1d\",\n        \"id\": \"edge-74\",\n        \"src\": \"node-a6\"\n      }\n    },\n    \"nodes\": {\n      \"node-1d\": {\n        \"id\": \"node-1d\",\n        \"typeId\": \"node-type-circle\",\n        \"consumerData\": {\n          \"nodeType\": \"circle\",\n          \"type\": \"intermediate-1\",\n          \"name\": \"service-b\",\n          \"isServer\": true,\n          \"isClient\": true,\n          \"language\": \"Java\",\n          \"url\": \"\"\n        }\n      },\n      \"node-dc\": {\n        \"id\": \"node-dc\",\n        \"typeId\": \"node-type-rectangle\",\n        \"consumerData\": {\n          \"nodeType\": \"rectangle\",\n          \"type\": \"backend\",\n          \"name\": \"service-d\",\n          \"isServer\": true,\n          \"isClient\": false,\n          \"language\": \"Golang\",\n          \"url\": \"\"\n        }\n      },\n      \"node-ee\": {\n        \"id\": \"node-ee\",\n        \"typeId\": \"node-type-circle\",\n        \"consumerData\": {\n          \"nodeType\": \"circle\",\n          \"type\": \"intermediate-2\",\n          \"name\": \"service-c\",\n          \"isServer\": true,\n          \"isClient\": true,\n          \"language\": \"NodeJs\",\n          \"url\": \"\"\n        }\n      },\n      \"node-a6\": {\n        \"id\": \"node-a6\",\n        \"typeId\": \"node-type-start-top-bottom\",\n        \"consumerData\": {\n          \"type\": \"frontend\",\n          \"name\": \"service-a\",\n          \"isServer\": true,\n          \"isClient\": true,\n          \"language\": \"NodeJs\",\n          \"url\": \"\"\n        }\n      }\n    }\n  }"
    }
    // When clicked, dispatch `generateProject`:
    const handleClick = () => dispatch(generateProject(object));
    return (
        <>
            <div>
                <button type="button" onClick={handleClick}>
                    {status === "loading"
                        ? "Generating Project"
                        : "Generate Project"}
                </button>
            </div>
            <div>
                {JSON.stringify(generatedProject)}
                {/*{generatedProject.name} and {generatedProject.fileChunk}*/}
            </div>
        </>
    );
}
export default GenerateProject;