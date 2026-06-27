import { useState, useEffect } from "react";
import toast from 'react-hot-toast'

import api from '../../api/axios'

import styles from './RecentReviewsCard.module.css'


function RecentReviewsCard() {
    const [reviews, setReviews] = useState([])
    const [selectedReview, setSelectedReview] = useState(null)
    const [reply, setReply] = useState('')

    async function loadReviews() {
        try {
            const response = await api.get('admin/reviews/')
            setReviews(response.data)
        } catch (error) {
            console.log(error.response)
            console.log(error)
        }
    }

    useEffect(() => {
        loadReviews()
    }, [])

    async function handleReply() {
        try {
            await api.patch(
                `/reviews/${selectedReview.id}/reply/`,
                {
                    admin_reply: reply,
                }
            )

            toast.success('Відповідь додано.')

            setSelectedReview(null)
            setReply('')

            await loadReviews()
        } catch (error) {
            toast.error(
                error.response?.data?.detail ||
                'Помилка.'
            )
        }
    }

    return (
        <>
            <div className={styles.card}>
                <h2>Останні відгуки</h2>
                {reviews.map(review => (
                    <div
                        key={review.id}
                        className={styles.review}
                    >
                        <div>
                            <strong>
                                {review.username}
                            </strong>

                            <div>
                                {'⭐'.repeat(review.rating)}
                            </div>

                            <p>
                                {review.text}
                            </p>

                            {review.admin_reply && (
                                <div className={styles.reply}>
                                    <strong>Відповідь:</strong>
                                    <p>
                                        {review.admin_reply}
                                    </p>
                                </div>
                            )}
                        </div>

                        {!review.admin_reply && (
                            <button
                                onClick={() => {
                                    setSelectedReview(review)
                                }}
                            >
                                Відповідь
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {selectedReview && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        
                        <h2>Відповідь на відгук</h2>
                        <p>{selectedReview.text}</p>
                        <textarea
                            rows='5'
                            value={reply}
                            onChange={e => 
                                setReply(e.target.value)
                            }
                        />
                        <div className={styles.buttons}>
                            <button
                                onClick={() => 
                                    setSelectedReview(null)
                                }
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleReply}
                            >
                                Надіслати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default RecentReviewsCard