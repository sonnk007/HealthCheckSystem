using System.Runtime.Serialization;

namespace HCS.Domain.CustomExceptions
{
    public class MedicalRecordNotPaidBeforeCheckUpException : Exception
    {
        public MedicalRecordNotPaidBeforeCheckUpException()
        {
        }

        public MedicalRecordNotPaidBeforeCheckUpException(string? message) : base(message)
        {
        }

        public MedicalRecordNotPaidBeforeCheckUpException(string? message, Exception? innerException) : base(message, innerException)
        {
        }

        protected MedicalRecordNotPaidBeforeCheckUpException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
