import styles from './BackgroundDecor.module.css'

import photo1 from '../../assets/decorations/photo1.png'
import photo2 from '../../assets/decorations/photo2.png'
import photo3 from '../../assets/decorations/photo3.png'
import photo4 from '../../assets/decorations/photo4.png'
import photo5 from '../../assets/decorations/photo5.png'
import photo6 from '../../assets/decorations/photo6.png'
import photo7 from '../../assets/decorations/photo7.png'
import photo8 from '../../assets/decorations/photo8.png'
import photo9 from '../../assets/decorations/photo9.png'
import photo10 from '../../assets/decorations/photo10.png'
import photo11 from '../../assets/decorations/photo11.png'
import photo12 from '../../assets/decorations/photo12.png'
import photo13 from '../../assets/decorations/photo13.png'
import photo14 from '../../assets/decorations/photo14.png'


function BackgroundDecor() {
    return (
        <div className={styles.wrapper}>
            <img src={photo11} className={styles.photo111} />
            <img src={photo1} className={styles.photo1} />
            <img src={photo2} className={styles.photo2} />
            {/* <img src={photo3} className={styles.photo3} /> */}
            <img src={photo4} className={styles.photo4} />
            <img src={photo5} className={styles.photo5} />
            <img src={photo6} className={styles.photo6} />
            <img src={photo7} className={styles.photo7} />
            <img src={photo8} className={styles.photo8} />
            <img src={photo9} className={styles.photo9} />
            <img src={photo10} className={styles.photo10} />
            <img src={photo11} className={styles.photo11} />
            <img src={photo12} className={styles.photo12} />
            <img src={photo13} className={styles.photo13} />
            <img src={photo14} className={styles.photo14} />
        </div>
    )
}

export default BackgroundDecor