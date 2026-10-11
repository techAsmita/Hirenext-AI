"""add interview share token hash

Revision ID: a5856d8efa70
Revises: 8c76230c8ac5
Create Date: 2026-10-06 18:09:42.037774

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a5856d8efa70'
down_revision: Union[str, Sequence[str], None] = '8c76230c8ac5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "interviews",
        sa.Column("share_token_hash", sa.String(length=128), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("interviews", "share_token_hash")
