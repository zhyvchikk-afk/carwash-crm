import { useEffect, useState, useMemo } from "react";

import api from '../../api/axios'

import styles from './GallerySection.module.css'

import {
    FiChevronLeft,
    FiChevronRight,
    FiX,
} from 'react-icons/fi'


function GallerySection() {
    const [images, setImages] = useState([])
    const [category, setCategory] = useState('all')
    const [selectedImage, setSelectedImage] = useState(null)

    async function loadGallery() {
        try {
            const response = await api.get('/gallery/')

            setImages(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadGallery()
    }, [])

    const filteredImages = useMemo(() => {
        if (category === 'all') {
            return images
        }

        return images.filter(
            image => image.category === category
        )
    }, [images, category])

    const selectedIndex = filteredImages.findIndex(
        image => image.id === selectedImage?.id
    )

    function showPrevious() {
        if (selectedIndex <= 0) return

        setSelectedImage(filteredImages[selectedIndex - 1])
    }

    function showNext() {
        if (
            selectedIndex >= filteredImages.length - 1
        ) return

        setSelectedImage(
            filteredImages[selectedIndex + 1]
        )
    }

    useEffect(() => {
        function handleKeyDown(event) {
            if (!selectedImage) {
                return
            }

            switch (event.key) {
                case 'ArrowLeft':
                    showPrevious()
                    break
                case 'ArrowRight':
                    showNext()
                    break
                case 'Escape':
                    setSelectedImage(null)
                    break
                default:
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown
            )
        }
    }, [selectedImage, filteredImages])

    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [selectedImage])

    const categoryNames = {
        before: 'До',
        after: 'Після',
        process: 'Процес',
        services: 'Послуги',
    }

    return (
        <>
            <section className={styles.section}>
                <h2 className={styles.title}>
                    Галерея робіт
                </h2>

                <p className={styles.subtitle}>
                    Подивіться результати наших робіт
                </p>

                <div className={styles.filters}>
                    <button
                        onClick={() => setCategory('all')}
                    >
                        Усі
                    </button>

                    <button
                        onClick={() => setCategory('before')}
                    >
                        До
                    </button>

                    <button
                        onClick={() => setCategory('after')}
                    >
                        Після
                    </button>

                    <button
                        onClick={() => setCategory('process')}
                    >
                        Процес
                    </button>

                    <button
                        onClick={() => setCategory('service')}
                    >
                        Послуги
                    </button>
                </div>
                <div className={styles.grid}>
                    {filteredImages.map(image => (
                        <div
                            key={image.id}
                            className={styles.card}
                            onClick={() => 
                                setSelectedImage(image)
                            }
                        >
                            <img
                                src={image.image}
                                alt={image.title}
                            />

                            <div className={styles.overlay}>
                                <h3>{image.title}</h3>
                                <span>
                                    {categoryNames[image.category]}
                                </span>
                            </div>
                        </div>
                    ))}
                    {filteredImages.length === 0 && (
                        <div className={styles.emptyGallery}>
                            📷
                            <h3>Галерея поповнюється</h3>
                            <p>
                                Незабаром тут з'являться фотографії
                                наших робіт.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {selectedImage && (
                <div
                    className={styles.modal}
                    onClick={() => 
                        setSelectedImage(null)
                    }
                >
                    <button
                        className={styles.close}
                        onClick={() => setSelectedImage(null)}
                    >
                        <FiX />
                    </button>

                    <button
                        className={styles.prev}
                        onClick={e => {
                            e.stopPropagation()
                            showPrevious()
                        }}
                    >
                        <FiChevronLeft />
                    </button>

                    <div
                        className={styles.modalContent}
                        onClick={e => e.stopPropagation()}
                    >
                        <img 
                            src={selectedImage.image} 
                            alt={selectedImage.title}
                        />

                        <h3>
                            {selectedImage.title}
                        </h3>

                        {selectedImage.description && (
                            <p>
                                {selectedImage.description}
                            </p>
                        )}

                        <span>
                            {selectedIndex + 1} / {filteredImages.length}
                        </span>
                    </div>
                    <button
                        className={styles.next}
                        onClick={e => {
                            e.stopPropagation()
                            showNext()
                        }}
                    >
                        <FiChevronRight />
                    </button>
                </div>
            )}

        </>
    )
}

export default GallerySection