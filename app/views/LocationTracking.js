import React, {
    Component
} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Linking,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,BackHandler
} from 'react-native';
import colors from "../constants/colors";
import LocationServices from '../services/LocationService';
import exportImage from './../assets/images/export.png';
import news from './../assets/images/newspaper.png';

import pkLogo from './../assets/images/PKLogo.png';

import {GetStoreData, SetStoreData} from '../helpers/General';

const width = Dimensions.get('window').width;

class LocationTracking extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLogging:''
        }
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress); 
        GetStoreData('PARTICIPATE')
        .then(isParticipating => {
            console.log(isParticipating);
               
                if(isParticipating === 'true'){
                    this.setState({
                        isLogging:true
                    })
                    this.willParticipate()
                }
                else{
                    this.setState({
                        isLogging:false
                    }) 
                }
        })
        .catch(error => console.log(error))
    }
    componentWillUnmount() {     BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);   }   

    handleBackPress = () => {     
        BackHandler.exitApp(); // works best when the goBack is async     
        return true;   
    };   
    export() {
        this.props.navigation.navigate('ExportScreen', {})
    }

    import() {
        this.props.navigation.navigate('ImportScreen', {})
    }

    news() {
        this.props.navigation.navigate('NewsScreen', {})
    }

    willParticipate =()=> {
        SetStoreData('PARTICIPATE', 'true').then(() =>
            LocationServices.start()
        );
        this.setState({
            isLogging:true
        })
    }

    setOptOut =()=>{
        LocationServices.optOut(this.props.navigation)
        this.setState({
            isLogging:false
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >

                <ScrollView contentContainerStyle={styles.main}>
                    <View style={styles.topView}>
                        <View style={styles.intro} >

                            <Text style={styles.headerTitle}>Private Kit</Text>

                            {
                                this.state.isLogging  ? (
                                    <>
                                    <Image source={pkLogo} style={{width:132,height:164.4,alignSelf:'center',marginTop:12}} />

                                <TouchableOpacity onPress={() => this.setOptOut()} style={styles.stopLoggingButtonTouchable} >
                                <Text style={styles.stopLoggingButtonText}>STOP LOGGING</Text>
                            </TouchableOpacity>
                            </>
                            ) : ( 
                            <>
                            <Image source={pkLogo} style={{width:132,height:164.4,alignSelf:'center',marginTop:12,opacity:.3}} />
                            <TouchableOpacity onPress={() => this.willParticipate()} style={styles.startLoggingButtonTouchable} >
                                <Text style={styles.startLoggingButtonText}>START LOGGING</Text>
                            </TouchableOpacity>
                            </>)
                            }
                           
                           {this.state.isLogging ?  
                            <Text style={styles.sectionDescription}>It is currently logging your location privately every five minutes. Your location information will NOT leave your phone.</Text> :
                           <Text style={styles.sectionDescription} >NOTE: After clicking this button you may be prompted to grant Private Kit access to your location.</Text> }
                           

                            {/* <Text style={styles.sectionDescription}>Private Kit is your personal vault that nobody else can access.</Text> */}

                        </View>
                    </View>

                    <View style={styles.actionButtonsView}>
                        <TouchableOpacity onPress={() => this.import()}  style={styles.actionButtonsTouchable}>
                            <Image style={styles.actionButtonImage} source={exportImage} resizeMode={'contain'}></Image>
                            <Text style={styles.actionButtonText}>Import</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.export()} style={styles.actionButtonsTouchable}>
                            <Image style={[styles.actionButtonImage,{transform:[{rotate:'180deg'}]}]} source={exportImage} resizeMode={'contain'}></Image>
                            <Text style={styles.actionButtonText}>Export</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.news()} style={styles.actionButtonsTouchable}>
                            <Image style={styles.actionButtonImage} source={news} resizeMode={'contain'}></Image>
                            <Text style={styles.actionButtonText}>News</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Text style={[styles.sectionDescription, { textAlign: 'center', paddingTop: 15 }]}>For more information visit the Private Kit hompage:</Text>
                    <Text style={[styles.sectionDescription, { color: 'blue', textAlign: 'center',marginTop:0 }]} onPress={() => Linking.openURL('https://privatekit.mit.edu')}>privatekit.mit.edu</Text>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    // Container covers the entire screen
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.PRIMARY_TEXT,
        backgroundColor: colors.WHITE,
    },
    headerTitle: {
        textAlign: 'center',
        fontSize: 38,
        padding: 0,
        fontFamily:'OpenSans-Bold'
    },
    subHeaderTitle: {
        textAlign: 'center',
        fontWeight: "bold",
        fontSize: 22,
        padding: 5
    },
    main: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: "80%"
    },
    block: {
        margin: 20,
        width: "100%"
    },
    footer: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingBottom: 10
    },
    intro: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    sectionDescription: {
        fontSize: 12,
        lineHeight: 24,
        fontFamily:'OpenSans-Regular',
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    startLoggingButtonTouchable:{
        borderRadius: 12,
        backgroundColor: "#665eff",
        height:52,
        alignSelf:'center',
        width:width*.7866,
        marginTop:30,
        justifyContent:'center'
    },
    startLoggingButtonText:{
        fontFamily: "OpenSans-Bold",
        fontSize: 14,
        lineHeight: 19,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff"
    },
    stopLoggingButtonTouchable:{
        borderRadius: 12,
        backgroundColor: "#fd4a4a",
        height:52,
        alignSelf:'center',
        width:width*.7866,
        marginTop:30,
        justifyContent:'center',
    },
    stopLoggingButtonText:{
        fontFamily: "OpenSans-Bold",
        fontSize: 14,
        lineHeight: 19,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff"
    },
    actionButtonsView:{
        width:width*.7866,
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:64
    },
    actionButtonsTouchable:{
        height: 76,
        borderRadius: 8,
        backgroundColor: "#454f63",
        width:width*.23,
        justifyContent:'center',
        alignItems:'center'
    },
    actionButtonImage:{
        height:21.6,
        width:32.2
    },
    actionButtonText:{
        opacity: 0.56,
        fontFamily: "OpenSans-Bold",
        fontSize: 12,
        lineHeight: 17,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff",
        marginTop:6
    }
});

export default LocationTracking;
